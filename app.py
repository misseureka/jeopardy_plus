from asyncio import Lock

from aiohttp import web

import socketio

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)
lock = Lock()


class Player(object):
    def __init__(self, name, score, sid):
        self.name = name
        self.score = score
        self.sid = sid


class Jeopardy(object):
    players = []
    is_game_started = False
    is_host_connected = False
    already_answered = False
    host_sid = None

    @classmethod
    def push_button(cls):
        if lock.locked() or cls.already_answered:
            return False

        with (yield from lock):
            if not cls.already_answered:
                cls.already_answered = True
                return True
        return False

    @classmethod
    def get_player(cls, sid):
        p = next(x for x in cls.players if x.sid == sid)
        return p

async def index(request):
    print('Index called')
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')


@sio.on('login', namespace='')
async def login_message(sid, message):
    print('Player logged in.')
    team_name = message['teamName']
    if team_name == 'host':
        Jeopardy.is_host_connected = True
        Jeopardy.host_sid = sid
    else:
        player = Player(team_name, 0, sid)
        Jeopardy.players.append(player)
    if len(Jeopardy.players) > 3:
        for player in Jeopardy.players:
            print('{} {} {}'.format(player.name, player.score, player.sid))


@sio.on('host_started_game', namespace='')
async def host_started_game_message(sid, message):
    print('Host started game.')
    assert sid == Jeopardy.host_sid
    Jeopardy.is_game_started = True
    await sio.emit('game_started', namespace='')


@sio.on('player_pushed_button', namespace='')
async def player_pushed_button(sid, message):
    p = Jeopardy.get_player(sid)
    if Jeopardy.push_button():
        print('Player {} was the first one'.format(p.name))
        return True
    return False


@sio.on('disconnect request', namespace='')
async def disconnect_request(sid):
    # TODO: show team name
    # print('Disconnect request from sid: {}'.format(sid))
    await sio.disconnect(sid, namespace='/test')


@sio.on('connect', namespace='')
async def connect(sid, environ):
    # print('Handled connect from sid {}, environ: {}'.format(sid, environ))
    await sio.emit('jeo_response', {'data': 'Connected', 'count': 0}, room=sid,
                   namespace='')


@sio.on('disconnect', namespace='')
def disconnect(sid):
    print('Client {} disconnected'.format(sid))


app.router.add_static('/scripts', 'scripts')
app.router.add_get('/', index)


if __name__ == '__main__':
    # sio.start_background_task(background_task)
    web.run_app(app, host='127.0.0.1', port=5000)
