import paho.mqtt.client as mqtt
import sys
import importlib
import psycopg2
import traceback
from dotenv import load_dotenv
import os

if os.getenv('NODE_ENV'):
    NODE_ENV = os.getenv('NODE_ENV')
else:
    NODE_ENV = 'development'
env_path = os.getcwd()+'/environments/' + NODE_ENV + '.env'
print(env_path)
load_dotenv(dotenv_path=env_path)


parser_db_connection = psycopg2.connect(host=os.getenv('DB_HOST'), dbname=os.getenv('DB_NAME_SENSOR'), user=os.getenv('DB_USER'), password=os.getenv('DB_PASSWORD'), port='5432')
parser_db_cursor = parser_db_connection.cursor()

api_db_connection = psycopg2.connect(host=os.getenv('DB_HOST'), dbname=os.getenv('DB_NAME_PLATFORM'), user=os.getenv('DB_USER'), password=os.getenv('DB_PASSWORD'), port='5432')
api_db_cursor = api_db_connection.cursor()


def on_connect(client1, userdata, flags, rc):
    print('Connected with result code {}'.format(str(rc)))

    # get topic from database
    api_db_cursor.execute('SELECT topic FROM parser WHERE id = %s', (int(parser_id),))
    topic = api_db_cursor.fetchone()[0]
    print(topic)

    # to renew subscriptions after reconnection
    res = client.subscribe(topic, qos=2)  # '$SYS/#'
    print('subscribing result {}'.format(res))


def on_message(client, userdata, msg):
    parser_module.on_message(msg, parser_db_connection, parser_db_cursor)
    # print('{topic} {payload}'.format(topic=msg.topic, payload=msg))


# Get parser_id from script-argument
parser_id = sys.argv[1]
print(parser_id)
try:
    # load parsers as module
    parser_module = importlib.import_module(parser_id + '.main')
    print(parser_module)

    if len(sys.argv) > 2 and sys.argv[2] == 'init':  # initialize table/... for parser
        parser_module.init(parser_db_connection, parser_db_cursor)
    elif len(sys.argv) > 2 and sys.argv[2] == 'clear': # clear all parsed data
        print("clearing")
        parser_module.clear(parser_db_connection, parser_db_cursor)
    else:  # run the parser (listen for mqtt on_message)
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message

        client.connect(host='172.24.25.65', port=1883, keepalive=60) # test.mosquitto.org # '172.24.25.65'
        client.loop_forever()
except ImportError as e:
    # Display error message
    print('error while importing parser-module')
    print(parser_id + '.' + parser_id)
    print(sys.exc_info()[0])
    print(traceback.format_exc())
