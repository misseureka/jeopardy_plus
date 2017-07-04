from asyncio import Lock
from aiohttp import web
import io
import socketio

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)
lock = Lock()


class Player(object):
    def __init__(self, name, score, sid, team_name=None):
        self.name = name
        self.score = score
        self.sid = sid
        self.team_name = team_name


class Jeopardy(object):
    players = []
    is_game_started = False
    is_host_connected = False
    host_sid = None
    current_question_answered = False
    question_active = False

    @classmethod
    def push_button(cls):
        if lock.locked() or cls.current_question_answered or not cls.question_active:
            return False

        with (yield from lock):
            if not cls.current_question_answered:
                cls.current_question_answered = True
                return True
        return False

    @classmethod
    def get_player(cls, sid):
        p = next(x for x in cls.players if x.sid == sid)
        return p

    @classmethod
    def update_score(cls, player_sid, score):
        for idx, player in enumerate(cls.players):
            if player.sid == player_sid:
                cls.players[idx].score += score
                return cls.players[idx].score


async def index(request):
    print('Index called')
    with io.open('index.html', 'r', encoding='utf8') as f:
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
        if Jeopardy.host_sid:
            players = []
            for player in Jeopardy.players:
                p = {'name': player.name,
                     'score': player.score}
                players.append(p)
            await sio.emit('update_board_players', players, sid=Jeopardy.host_sid)
    if len(Jeopardy.players):
        print('==> Current players are: ')
        for player in Jeopardy.players:
            print('{} {} {}'.format(player.name, player.score, player.sid))


@sio.on('host_started_game', namespace='')
async def host_started_game_message(sid, message):
    print('Host started THE game.')
    assert sid == Jeopardy.host_sid
    Jeopardy.is_game_started = True
    await sio.emit('game_started', namespace='')


@sio.on('question_answered', namespace='')
async def host_accepted_question(sid, message):
    assert sid == Jeopardy.host_sid
    Jeopardy.current_question_answered = False
    print('Host accepted question with data {}'.format(message))
    score = message['currentScore']
    if not score:
        return
    player_sid = message['currentSid']
    total = Jeopardy.update_score(player_sid, int(score))
    player_name = message['currentPlayer']
    await sio.emit('update_score', {'total': total, 'playerName': player_name}, sid=player_sid)
    players = []
    for player in Jeopardy.players:
        p = {'name': player.name,
             'score': player.score}
        players.append(p)
    await sio.emit('update_board_players', players, sid=Jeopardy.host_sid)


@sio.on('question_active', namespace='')
async def question_active(sid, active):
    assert sid == Jeopardy.host_sid
    Jeopardy.question_active = active


@sio.on('player_pushed_button', namespace='')
async def player_pushed_button(sid, message):
    if not Jeopardy.question_active:
        return False

    print(message)
    p = Jeopardy.get_player(sid)
    # FIXME: check if there is active question, do nothing otherwise
    if Jeopardy.push_button():
        print('Player {} was the first one'.format(p.name))
        await sio.emit('player_ready', {'sid': p.sid, 'name': p.name}, skip_sid=sid)
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
app.router.add_static('/css', 'css')
app.router.add_static('/media', 'media')
app.router.add_get('/', index)


if __name__ == '__main__':
    web.run_app(app, host='0.0.0.0', port=80)
