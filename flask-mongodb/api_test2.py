import json
import unittest
import requests


class ApiTest(unittest.TestCase):
    API_URL = "http://localhost:5000/"

    USER_OBJECT_REGISTER = {
        "email": "test@test.com",
        "fullName": "My nam is test",
        "password": "A5dR75fG4rTp"
    }

    USER_OBJECT_LOGIN = {
        "email": "test@test.com",
        "password": "A5dR75fG4rTp"
    }

    USER_MODIFIED_NAME = {
        "name": 'I am now modified test',
        "role": 'modified role'
    }

    # Admin object
    ADMIN_OBJECT_LOGIN = {
        "email": "a@a.a",
        "password": "A5dR75fG4rTp"
    }

    # Connecting as Admin for token administration tests
    USER_RESPONSE_TOKEN = requests.post(API_URL + "login", json=USER_OBJECT_LOGIN)
    USER_RESPONSE_TOKEN_CONTENT = json.loads(USER_RESPONSE_TOKEN.content)
    USER_TOKEN_HEADER = {'Authorization': 'Bearer ' + USER_RESPONSE_TOKEN_CONTENT["token"]}

    # Connecting as Admin for token administration tests
    ADMIN_RESPONSE_TOKEN = requests.post(API_URL + "login", json=ADMIN_OBJECT_LOGIN)
    ADMIN_RESPONSE_TOKEN_CONTENT = json.loads(ADMIN_RESPONSE_TOKEN.content)
    ADMIN_TOKEN_HEADER = {'Authorization': 'Bearer ' + ADMIN_RESPONSE_TOKEN_CONTENT['token']}

    def test_register(self):
        response = requests.post(self.API_URL + "register", json=ApiTest.USER_OBJECT_REGISTER)
        self.assertEqual(response.status_code, 201)

    def test_login(self):
        response = requests.post(self.API_URL + "login", json=ApiTest.USER_OBJECT_LOGIN)
        self.assertEqual(response.status_code, 200)

    def test_get_profiles(self):
        response = requests.get(self.API_URL + "accounts", headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_mod_user(self):
        response = requests.put(self.API_URL + "/mod_user/test@test.com?name=" + self.USER_MODIFIED_NAME['name']
                                + "&role=" + self.USER_MODIFIED_NAME['role'], headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    # def test_upd_password(self):
    #     response = requests.put(self.API_URL + "/mod_user/test@test.com?name=" + self.USER_MODIFIED_NAME['name']
    #                             + "&role=" + self.USER_MODIFIED_NAME['role'], headers=self.ADMIN_TOKEN_HEADER)
    #     self.assertEqual(response.status_code, 200)

    def test_del_user(self):
        response = requests.put(self.API_URL + "/mod_user/test@test.com?name=" + self.USER_MODIFIED_NAME['name']
                                + "&role=" + self.USER_MODIFIED_NAME['role'], headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
