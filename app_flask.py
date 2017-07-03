# set async_mode to 'threading', 'eventlet', 'gevent' or 'gevent_uwsgi' to
# force a mode else, the best mode is selected automatically from what's
# installed
async_mode = 'threading'

import time
from flask import Flask, render_template, send_from_directory
import socketio

sio = socketio.Server(logger=True, async_mode=async_mode)
app = Flask(__name__)
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)
app.config['SECRET_KEY'] = 'secret!'
thread = None
default_namespace = ''

def background_thread():
    count = 0
    while True:
        sio.sleep(15)
        count += 1
        sio.emit('jeo_response', {'data': 'Server generated event data'},
                 namespace=default_namespace)

@app.route('/')
def index():
    global thread
    if thread is None:
        thread = sio.start_background_task(background_thread)
    return render_template('index.html')

@app.route('/scripts/<path:path>')
def send_js(path):
    print(path)
    return send_from_directory('scripts', path)

@sio.on('player_connected', namespace=default_namespace)
def test_message(sid, message):
    sio.emit('jeo_response', {'data': 'Hey there!'}, room=sid,
             namespace=default_namespace)


@sio.on('player_event', namespace=default_namespace)
def test_message(sid, message):
    sio.emit('jeo_response', {'data': message['data']}, room=sid,
             namespace=default_namespace)


@sio.on('my broadcast event', namespace='/test')
def test_broadcast_message(sid, message):
    sio.emit('jeo response', {'data': message['data']}, namespace=default_namespace)


@sio.on('disconnect request', namespace=default_namespace)
def disconnect_request(sid):
    sio.disconnect(sid, namespace=default_namespace)


@sio.on('connect', namespace=default_namespace)
def test_connect(sid, environ):
    sio.emit('jeo_response', {'data': 'Connected', 'count': 0}, room=sid,
             namespace=default_namespace)


@sio.on('disconnect', namespace=default_namespace)
def test_disconnect(sid):
    print('Client disconnected')


if __name__ == '__main__':
    if sio.async_mode == 'threading':
        # deploy with Werkzeug
        app.run(threaded=True)
    elif sio.async_mode == 'eventlet':
        # deploy with eventlet
        import eventlet
        import eventlet.wsgi
        eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
    elif sio.async_mode == 'gevent':
        # deploy with gevent
        from gevent import pywsgi
        try:
            from geventwebsocket.handler import WebSocketHandler
            websocket = True
        except ImportError:
            websocket = False
        if websocket:
            pywsgi.WSGIServer(('', 5000), app,
                              handler_class=WebSocketHandler).serve_forever()
        else:
            pywsgi.WSGIServer(('', 5000), app).serve_forever()
    elif sio.async_mode == 'gevent_uwsgi':
        print('Start the application through the uwsgi server. Example:')
        print('uwsgi --http :5000 --gevent 1000 --http-websockets --master '
              '--wsgi-file app.py --callable app')
    else:
        print('Unknown async_mode: ' + sio.async_mode)
