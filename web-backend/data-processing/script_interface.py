import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import sys
import importlib
import datetime
import traceback
import os

if os.getenv('NODE_ENV'):
    NODE_ENV = os.getenv('NODE_ENV')
else:
    NODE_ENV = 'development'
env_path = os.getcwd()+'/environments/' + NODE_ENV + '.env'

load_dotenv(dotenv_path=env_path)


sensor_db_connection = psycopg2.connect(host=os.getenv('DB_HOST'), dbname=os.getenv('DB_NAME_SENSOR'), user=os.getenv('DB_USER'), password=os.getenv('DB_PASSWORD'), port='5432')
sensor_db_cursor = sensor_db_connection.cursor()

api_db_connection = psycopg2.connect(host=os.getenv('DB_HOST'), dbname=os.getenv('DB_NAME_PLATFORM'), user=os.getenv('DB_USER'), password=os.getenv('DB_PASSWORD'), port='5432')
api_db_cursor = api_db_connection.cursor()

def create_table(sql_string):
    # TODO check if there is a solution that is accessible and not vulnerable to injectione
    # something like this: sql_string = [['id', ['serial', 'PRIMARY KEY']], ['speed', ['float']]]
    sensor_db_cursor.execute(
        sql.SQL('DROP TABLE IF EXISTS {}').format(
            sql.Identifier(table_name)))
    sensor_db_cursor.execute(
        'CREATE TABLE {}'.format(table_name) + '(' + sql_string + ')')
    sensor_db_connection.commit()

    print('Created table')


def writer(list_of_fields: list, list_of_values: list):
    # print(list_of_values)
    sensor_db_cursor.execute(
        sql.SQL('INSERT INTO {} ({}) values ({})').format(
            sql.Identifier(table_name),
            sql.SQL(', ').join(map(sql.Identifier, list_of_fields)),
            sql.SQL(', ').join(map(sql.Literal, list_of_values))))
    sensor_db_connection.commit()
    print('Writer of interface received' + str(list_of_fields) + str(list_of_values))


# Get script_id from script-argument
script_name = sys.argv[1]
print(script_name)
try:
    # load script as module
    script_module = importlib.import_module('scripts.' + script_name + '.' + script_name)
    print(script_module)
    table_name = 'script_' + script_name
    if len(sys.argv) > 2:
        cron = sys.argv[2]
    else:
        cron = None

    api_db_cursor.execute('INSERT INTO script_run (timestamp, status, "scriptId", error, pid, "cronId") values (%s, %s, %s, %s, %s, %s) RETURNING id', (datetime.datetime.now(), 'RUNNING', script_name, '', os.getpid(), cron))
    script_run_id = api_db_cursor.fetchone()[0]
    print(script_run_id)
    api_db_connection.commit()

    # actually run the script
    try:
        script_module.run(sensor_db_cursor, create_table, writer)
        error = ''
        status = 'SUCCESS'
    except Exception as e:
        print(traceback.format_exc())
        error = traceback.format_exc()
        status = 'ERROR'
        sensor_db_connection.rollback()

    api_db_cursor.execute('UPDATE script_run SET status=%s, error=%s, pid=%s WHERE id=%s', (status, error, None, script_run_id))
    api_db_connection.commit()
    print('closing')
    sensor_db_cursor.close()
    sensor_db_connection.close()
    api_db_cursor.close()
    api_db_connection.close()
except ImportError as e:
    # Display error message
    print('error while importing script-module')
    print('scripts.' + script_name + '.' + script_name)
    print(sys.exc_info()[0])
    print(traceback.format_exc())
