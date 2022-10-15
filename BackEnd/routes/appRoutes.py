from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Request
from model import schema
import json

router = APIRouter()
registeredUsers = {}

@router.post("/register", status_code=status.HTTP_200_OK)
async def register(user: schema.User):

    if user.username in registeredUsers.keys():
        return HTTPException(status_code=500, detail="A user with name " + user["username"] + " already exists")

    registeredUsers[user.username] = user.password
    return {"message" : "registered user"}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: schema.User):

    if user.username not in registeredUsers.keys():
        return HTTPException(status_code=404, detail="User with name " + user["username"] + " does not exist")

    if registeredUsers[user.username] != user.password:
        return HTTPException(status_code=401, detail="Wrong password")
    return {"message" : "ok"}

