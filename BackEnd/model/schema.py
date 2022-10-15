from typing import Union
from pydantic import BaseModel
from tomlkit import integer


class User(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    age: Union[int, None] = None
    phone_number : Union[str, None] = None
    location: str
    login: bool

class UserLogin(BaseModel):
    username: str
    password: str    