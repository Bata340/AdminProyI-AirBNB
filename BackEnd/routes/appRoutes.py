from typing import Optional
from fastapi import APIRouter
from fastapi import APIRouter, Depends, HTTPException, status, Request
from model import schema
import uuid


router = APIRouter()

registeredUsers = {}
registeredUsers['generico'] =  schema.User(
        username = "generico",
        password = "generico",
        first_name = "Usuario",
        last_name = "Generico",
        age = 30,
        phone_number = 2222-343434,
        location = "Argentina",
        login = False
    )
registeredProperties = {}
registeredExperiences = {}

reserveProperties = {}
ReserveExperience = {}

def filterByOwner(registryList, owner):
    if owner is not None: 
        ownersRegistryList = []
        for key, value in registeredExperiences.items():
            if value.owner == owner:
                registry = registeredExperiences[key]
                ownersRegistryList.append(registry)
        return ownersRegistryList
    return registryList

def filterExperiencesByType(experiences, typeOfExperience):
    if typeOfExperience is not None: 
        experienceList = []
        for key, value in experiences.items():
            if value.type == typeOfExperience:
                experience = experiences[key]
                experienceList.append(experience)
        return experienceList
    return experiences


def removeNoneValues(dict_aux: dict):
    dict_aux2 = {}
    for key, value in dict_aux.items():
        if value is not None:
            dict_aux2[key] = value
    return dict_aux2

@router.post("/register", status_code=status.HTTP_200_OK)
async def register(user: schema.User):

    if user.username in registeredUsers.keys():
        return HTTPException(status_code=500, detail="A user with name " + user["username"] + " already exists")
    user.login = False
    registeredUsers[user.username] = user
    return {"message" : "registered user " +  user.username}


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: schema.UserLogin):

    if user.username not in registeredUsers.keys():
        return HTTPException(status_code=404, detail="User with name " + user.username + " does not exist")
    if registeredUsers[user.username].password != user.password:
        return HTTPException(status_code=401, detail="Wrong password")
    registeredUsers[user.username].login = True
    return {"message" : "ok"}

@router.get("/users/{username}", status_code=status.HTTP_200_OK)
async def getUser(username: str):
    if username not in registeredUsers.keys():
        return HTTPException(status_code=404, detail="User with name " + username + " does not exist")
    return {"message": registeredUsers[username]}


@router.post("/property/", status_code=status.HTTP_200_OK)
async def create_property(property: schema.Property):
    id = str(uuid.uuid4())
    registeredProperties[id] = property
    reserveProperties[id] = []
    return {"message" : "register propery with id: " + id}

@router.get("/property/{id}", status_code=status.HTTP_200_OK)
async def getProperty(id: str):
    if id not in registeredProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
    
    return {"message": registeredProperties[id]}


@router.patch("/property/{id}", status_code=status.HTTP_200_OK)
async def update_property(id: str, property: schema.PropertyPatch):
    if id not in registeredProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")

    stored_property_data = registeredProperties[id]
    update_data = property.dict(exclude_unset=True)
    updated_property = stored_property_data.copy(update=update_data)
    registeredProperties[id] = updated_property

    return {"message": registeredProperties[id]}

@router.delete("/property/{id}", status_code=status.HTTP_200_OK)
async def delete_property(id: str):
    if id not in registeredProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
    registeredProperties.pop(id)
    return {"message": "property with id " + id + "was deleted"} 

@router.get("/properties", status_code=status.HTTP_200_OK)
async def get_property(owner: Optional[str] = None):
    return filterByOwner(registeredProperties, owner)


@router.post("/property/reserve/{id}", status_code=status.HTTP_200_OK)
async def reserve_property(id:str, reserve: schema.Reservation):
    if id not in reserveProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")

    reserveProperties[id].append(reserve)
    return {"message": "Property with id " + id + "was reserve between " + reserve.dateFrom.strftime("%Y/%m/%d") + " and " + reserve.dateTo.strftime("%Y/%m/%d") }

@router.get("/property/reserveDates/{id}", status_code=status.HTTP_200_OK)
async def get_reserve_dates_for_property(id:str):
    if id not in reserveProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
    return {"message": reserveProperties[id]}


@router.get("/experiences", status_code=status.HTTP_200_OK)
async def get_experiences(owner: Optional[str] = None, typeOfExperience: Optional[str] = None): 
    ownersProperties = filterByOwner(registeredExperiences, owner)
    finalExperiences = filterExperiencesByType(registeredExperiences, typeOfExperience) 
    return registeredExperiences
    

@router.post("/experience", status_code=status.HTTP_200_OK)
async def create_experience(experience: schema.Experience):
    id = str(uuid.uuid4())
    registeredExperiences[id] = experience
    reserveExperience[id] = []
    return {"message" : "registered experience with id: " + id}


@router.post("/experience/reserve/{id}", status_code=status.HTTP_200_OK)
async def reserve_experience(id:str, reserve: schema.Reservation):
    if id not in ReserveExperience.keys():
        return HTTPException(status_code=404, detail="Experience with id " + id + " does not exist")

    reserveExperiences[id].append(reserve)
    return {"message": "Experience with id " + id + "was reserve between " + reserve.dateFrom.strftime("%Y/%m/%d") + " and " + reserve.dateTo.strftime("%Y/%m/%d") }