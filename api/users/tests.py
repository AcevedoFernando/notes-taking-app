from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.test import TestCase

from .models import User


class UserModelTest(TestCase):
    def test_user_is_subclass_of_abstract_base_user(self):
        self.assertTrue(issubclass(User, AbstractBaseUser))

    def test_auth_user_model_setting(self):
        self.assertEqual(settings.AUTH_USER_MODEL, 'users.User')
