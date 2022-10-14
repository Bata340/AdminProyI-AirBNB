from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Request
from models.models import User
import json

router = APIRouter()
registeredUsers = {}

@router.post("/register", status_code=status.HTTP_200_OK)
async def register(req: Request):

    user = json.loads(await req.body())

    if user['username'] in registeredUsers.keys():
        return HTTPException(status_code=500, detail="A user with name " + user["username"] + " already exists")

    registeredUsers[user['username']] = user["password"]
    return {"message" : "registered user"}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(req: Request):

    user = json.loads(await req.body())

    if user['username'] not in registeredUsers.keys():
        return HTTPException(status_code=500, detail="User with name " + user["username"] + " does not exist")

    registeredUsers[user['username']] = user["password"]
    return {"message" : "ok"}

