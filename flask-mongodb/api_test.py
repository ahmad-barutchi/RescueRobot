# This unit test done following Testing Flask Applications documentation at:
# https://flask.palletsprojects.com/en/2.2.x/testing/
# pytest version installed 7.0.0
import json

import pytest
from run import register
import unittest
import requests


class ApiTest(unittest.TestCase):
    API_URL = "http://localhost:5000/"

    USER_OBJECT_REGISTER = {
        "email": "ahmad.barutchi@gmail.com",
        "fullName": "Fin du Monde",
        "password": "1234"
    }

    USER_OBJECT_LOGIN = {
        "email": "b@b.b",
        "password": "1234"
    }

    USER_OBJECT_GET_ONE = {
        "name": 'first_name',
        "email": 'email',
    }

    TOKEN = ""

    def test_register(self):
        response = requests.post(self.API_URL + "register", json=ApiTest.USER_OBJECT_REGISTER)
        self.assertEqual(response.status_code, 201)

    def test_login(self):
        response = requests.post(self.API_URL + "login", json=ApiTest.USER_OBJECT_LOGIN)
        res = json.loads(response.content)
        self.TOKEN = res['token']
        print("from test_login: ", self.TOKEN)
        self.assertEqual(response.status_code, 200)

    # def test_get_profiles(self):
    #     response = requests.post(self.API_URL + "login", json=ApiTest.USER_OBJECT_LOGIN)
    #     res = json.loads(response.content)
    #     print("from test_get_profiles: ", res['token'])
    #     token_header = {'Authorization': 'Bearer ' + res['token']}
    #     print(token_header)
    #     response = requests.post(self.API_URL + "accounts", json=ApiTest.USER_OBJECT_GET_ONE, headers=token_header)
    #     self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
