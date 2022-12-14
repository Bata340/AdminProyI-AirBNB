from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import date


class User(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    age: Union[int, None] = None
    phone_number : Union[str, None] = None
    location: str
    login: bool
    score: Optional[List[int]] = None
    money: Optional[float] = 0

class UserLogin(BaseModel):
    username: str
    password: str    

class Property(BaseModel):
    key: Optional[str]
    name: str
    owner: str
    price: int
    description: str
    location: str
    score: Optional[List[int]] = None
    type: str
    services: Optional[List[str]] = None
    photos: Optional[List[str]] = None

class PropertyPatch(BaseModel):
    name: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None
    location: Optional[str] = None
    photos: Optional[List[str]] = None

class Reservation(BaseModel):
    id: Optional[str]
    propertyId: Optional[str] = None
    userid: str
    dateFrom: date
    dateTo: date


class Experience(BaseModel):
    key: Optional[str]
    name: str
    owner: str
    price: int
    description: str 
    location: str
    score: Optional[List[int]] = None
    photos: Union[List[str], None] = None
    type: str
    languages: List[str]

class ExperiencePatch(BaseModel):
    name: Optional[str]
    price: Optional[int]
    description: Optional[str] 
    location: Optional[str]
    photos: Optional[List[str]]
    languages: Optional[List[str]]

class PropertyFilters(BaseModel):
    
    owner: Optional[str] = None
    lowerPrice: Optional[int] = None
    highestPrice: Optional[int] = None
    location: Optional[str] = None 
    type: Optional[str] = None
    services: Optional[str] = None
    