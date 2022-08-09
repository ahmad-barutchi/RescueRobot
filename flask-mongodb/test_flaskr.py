# This unit test done following Testing Flask Applications documentation at:
# https://flask.palletsprojects.com/en/2.2.x/testing/
# pytest version installed 7.0.0

import pytest
from run import register


def test_register(client):
    response = client.get("/register")
    assert b"<h2>Hello, World!</h2>" in response.data

