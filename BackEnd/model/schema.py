from typing import List, Optional, Union
from pydantic import BaseModel



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

class Property(BaseModel):
    name: str
    owner: str
    price: int
    description: str
    location: str
    score: int
    photos: Union[List[str], None] = None

class PropertyPatch(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None
    location: Optional[str] = None
    photos: Optional[List[str]] = None