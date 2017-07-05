from aiohttp import web
import io
import socketio

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)


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
    someone_already_answering = False
    question_active = False
    players_already_tried = []

    @classmethod
    def push_button(cls, player_name):
        if not cls.question_active or cls.someone_already_answering:
            print("Someone is already answering, perhaps...")
            return False
        if player_name in cls.players_already_tried:
            print("We've already tried, sorry")
            return False

        print("We're good")
        cls.someone_already_answering = True
        cls.players_already_tried.append(player_name)
        print("Now we are answering")
        return True

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

    @classmethod
    def get_players_payload(cls):
        players = []
        for player in Jeopardy.players:
            p = {'name': player.name,
                 'score': player.score}
            players.append(p)
        return players

async def index(request):
    with io.open('index.html', 'r', encoding='utf8') as f:
        return web.Response(text=f.read(), content_type='text/html')


@sio.on('login', namespace='')
async def login_message(sid, message):
    team_name = message['teamName']
    if team_name == 'host':
        Jeopardy.is_host_connected = True
        Jeopardy.host_sid = sid
        Jeopardy.players = []
    else:
        player = Player(team_name, 0, sid)
        Jeopardy.players.append(player)
        if Jeopardy.host_sid:
            await sio.emit('update_board_players', Jeopardy.get_players_payload(), sid=Jeopardy.host_sid)


@sio.on('host_started_game', namespace='')
async def host_started_game_message(sid, message):
    assert sid == Jeopardy.host_sid
    Jeopardy.is_game_started = True
    await sio.emit('update_board_players', Jeopardy.get_players_payload(), sid=Jeopardy.host_sid)
    await sio.emit('game_started', namespace='')


@sio.on('question_answered', namespace='')
async def host_accepted_question(sid, message):
    assert sid == Jeopardy.host_sid
    score = message['currentScore']
    if not score:
        return
    player_sid = message['currentSid']
    total = Jeopardy.update_score(player_sid, int(score))
    player_name = message['currentPlayer']
    Jeopardy.someone_already_answering = False
    await sio.emit('update_score', {'total': total, 'playerName': player_name}, sid=player_sid)
    await sio.emit('update_board_players', Jeopardy.get_players_payload(), sid=Jeopardy.host_sid)


@sio.on('question_active', namespace='')
async def question_active(sid, active):
    assert sid == Jeopardy.host_sid
    Jeopardy.question_active = active
    if not active:
        Jeopardy.players_already_tried = []
        Jeopardy.someone_already_answering = False
    await sio.emit('useless_event_to_patch', {})


@sio.on('player_pushed_button', namespace='')
async def player_pushed_button(sid, message):
    if not Jeopardy.question_active:
        return False

    p = Jeopardy.get_player(sid)
    print(p.name)
    r = Jeopardy.push_button(p.name)
    if r:
        print('Player {} was the first one'.format(p.name))
        await sio.emit('player_ready', {'sid': p.sid, 'name': p.name}, skip_sid=sid)
    else:
        print('Player {} is a looser'.format(p.name))


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
