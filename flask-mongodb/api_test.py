import json
import unittest
import requests


class ApiTest(unittest.TestCase):
    """
    Routes tests using unittest library
    """

    API_URL = "http://localhost:5000/api/v1/"

    # USERS AND ADMINS TESTS

    USER_OBJECT_REGISTER = {
        "email": "test@test.com",
        "fullName": "My nam is test",
        "password": "A5dR75fG4rTp"
    }

    USER_OBJECT_LOGIN = {
        "email": "testy@test.com",
        "password": "A5dR75fG4rTp"
    }

    USER_OBJECT_PASSWORD_UPDATE = {
        "password": USER_OBJECT_LOGIN["password"],
    }

    MODIFIED_USER = {
        "name": 'I am now modified test',
        "password": "NF54fiIFDNd45",
        "role": 'modified role',
    }

    # Admin object
    ADMIN_OBJECT_LOGIN = {
        "email": "aa@a.aa",
        "password": "1234"
    }

    def test_register(self):
        response = requests.post(self.API_URL + "register", json=self.USER_OBJECT_REGISTER)
        self.assertEqual(response.status_code, 201)

    # Connecting as Admin for token administration tests
    ADMIN_RESPONSE_TOKEN = requests.post(API_URL + "login", json=ADMIN_OBJECT_LOGIN)
    ADMIN_RESPONSE_TOKEN_CONTENT = json.loads(ADMIN_RESPONSE_TOKEN.content)
    ADMIN_TOKEN_HEADER = {'Authorization': 'Bearer ' + ADMIN_RESPONSE_TOKEN_CONTENT['token']}

    # Connecting as User for token tests
    USER_RESPONSE_TOKEN = requests.post(API_URL + "login", json=USER_OBJECT_LOGIN)
    USER_RESPONSE_TOKEN_CONTENT = json.loads(USER_RESPONSE_TOKEN.content)
    if USER_RESPONSE_TOKEN.status_code == 200:
        USER_TOKEN_HEADER = {'Authorization': 'Bearer ' + USER_RESPONSE_TOKEN_CONTENT["token"]}
    else:
        USER_TOKEN_HEADER = {"token": ""}

    def test_login(self):
        response = requests.post(self.API_URL + "login", json=self.USER_OBJECT_LOGIN)
        self.assertEqual(response.status_code, 200)

    def test_get_profiles(self):
        response = requests.get(self.API_URL + "accounts", headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_mod_user(self):
        response = requests.put(self.API_URL + "mod_user/test@test.com?name=" + self.MODIFIED_USER['name']
                                + "&role=" + self.MODIFIED_USER['role'], headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_update_password(self):
        response = requests.post(self.API_URL + "password", json=self.USER_OBJECT_PASSWORD_UPDATE,
                                 headers=self.USER_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_del_user(self):
        response = requests.delete(self.API_URL + "del_user/test@test.com",
                                   headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    # SESSIONS TESTS

    SESSION_NAME = "Seance100"
    SESSION_NEW_NAME = "Seance101"

    def test_create_seance(self):
        response = requests.post(self.API_URL + "create_seance/" + self.SESSION_NAME,
                                 headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_get_seance(self):
        response = requests.get(self.API_URL + "get_seance/" + self.SESSION_NAME,
                                headers=self.USER_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_get_session_info(self):
        response = requests.get(self.API_URL + "session_info/" + self.SESSION_NAME,
                                headers=self.USER_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_all_sessions_man(self):
        response = requests.get(self.API_URL + "all_sessions_man", headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    # def test_mod_seance(self):
    #     response = requests.post(self.API_URL + "mod_seance/" + self.SESSION_NAME + "/" + self.SESSION_NEW_NAME,
    #                              headers=self.ADMIN_TOKEN_HEADER)
    #     self.assertEqual(response.status_code, 200)

    def test_del_seance(self):
        response = requests.delete(self.API_URL + "del_seance/" + self.SESSION_NEW_NAME,
                                   headers=self.ADMIN_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)

    def test_all_sessions(self):
        response = requests.get(self.API_URL + "all_sessions", headers=self.USER_TOKEN_HEADER)
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
