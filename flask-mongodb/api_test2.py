# This unit test done following Testing Flask Applications documentation at:
# https://flask.palletsprojects.com/en/2.2.x/testing/
# pytest version installed 7.0.0

import pytest
from run import register
import unittest
import requests


class ApiTest(unittest.TestCase):
    API_URL = "http://localhost:500/"

    def test_register(self):
        response = requests.get(self.API_URL + "bou")
        self.assertEqual(response.status_code, 201)


if __name__ == '__main__':
    unittest.main()
