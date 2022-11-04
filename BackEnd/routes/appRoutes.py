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

requestedreserveProperties = {}
ReserveExperience = {}
acceptedReservationProperties = {}

def findReservation(reservationId, propertyId):
    reservationlist = requestedreserveProperties[propertyId]
    aux = None
    for reservation in reservationlist:
        if reservation.id == reservationId:
            aux = reservation
    
    return aux

def filterExperiencesByOwner(registryList, owner):
    if owner is not None: 
        ownersRegistryList = []
        for key, value in registeredExperiences.items():
            if value.owner == owner:
                registry = registeredExperiences[key]
                ownersRegistryList.append(registry)
        return ownersRegistryList
    return registryList

def filterPropertiesByOwner(propiesties, owner):
    ownersRegistryList = []
    for value in propiesties:
        print(value)
        print(owner)
        if value.owner == owner:
            ownersRegistryList.append(value)
        print(value.owner)
    return ownersRegistryList

def filterPropertiesByLocation(properties, location):
    locationPropertiesList = []
    for value in properties:
        print(value.location == location)
        if value.location == location:
            locationPropertiesList.append(value)
    return locationPropertiesList

def filterPropertiesByPrice(properties, lowerPrice, higherPrice):
    pricePropertiesList = []
    for value in properties:
        if value.price >= lowerPrice and value.price<= higherPrice:
            pricePropertiesList.append(value)
    return pricePropertiesList

def filterPropertiesByType(properties, type):
    typePropertiesList = []
    for value in properties:
        if value.type == type:
            typePropertiesList.append(value)
    return typePropertiesList

def filterPropertiesByServices(properties, services):
    typePropertiesList = []
    for value in properties:
        if services in ",".join(value.services):
            typePropertiesList.append(value)
    return typePropertiesList

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
    registeredProperties[id] = schema.Property(
        key = id, 
        name = property.name,
        owner = property.owner,
        price = property.price,
        description = property.description,
        location = property.location,
        type = property.type,
        services = property.services,
        score = property.score,
        photos = property.photos
    )
    requestedreserveProperties[id] = []
    acceptedReservationProperties[id] = []
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

@router.delete("/property/{id_prop}/photos/{id_photo}")
async def delete_property(id_prop: str, id_photo: str):
    if id_prop not in registeredProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
    if id_photo not in registeredProperties[id_prop].photos:
        return HTTPException(status_code=404, detail="Photo with id " + id + " does not exist")
    registeredProperties[id_prop].photos.pop(registeredProperties[id_prop].photos.index(id_photo))
    return {"message": "photo with id " + id_photo + "was deleted from property with id " + id_prop } 

@router.get("/properties", status_code=status.HTTP_200_OK)
async def get_property(filters : schema.PropertyFilters = Depends()):
    filterProperties = [value for key , value in registeredProperties.items()]
    if (filters.owner is not None):
        aux = filterPropertiesByOwner(filterProperties, filters.owner)
        filterProperties = aux
       
    if (filters.lowerPrice is not None and filters.highestPrice is not None):
      
        aux = filterPropertiesByPrice(filterProperties, filters.lowerPrice, filters.highestPrice)
        filterProperties = aux
       
    if (filters.location is not None):
       
        aux = filterPropertiesByLocation(filterProperties, filters.location)
        filterProperties = aux
        
    if (filters.type is not None):
       
        aux = filterPropertiesByType(filterProperties, filters.type)
        filterProperties = aux
      
    if (filters.services is not None):
       
        aux = filterPropertiesByServices(filterProperties, filters.services)
        filterProperties = aux
        
    return filterProperties
        


@router.post("/property/reserve/{id}", status_code=status.HTTP_200_OK)
async def reserve_property(id:str, reserve: schema.Reservation):
    if id not in requestedreserveProperties.keys():
        return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
    reserve.id = str(uuid.uuid4())
    requestedreserveProperties[id].append(reserve)
    return {"message": "Reservation " + reserve.id  + " was requested  in property " + id + " between " + reserve.dateFrom.strftime("%Y/%m/%d") + " and " + reserve.dateTo.strftime("%Y/%m/%d") }

@router.post("/users/reservation/{reservationId}", status_code=status.HTTP_200_OK)
async def process_reservation(reservationId: str, status: str, propertyId: str):
    reservation = findReservation(reservationId, propertyId)
    if reservation is None: 
        return HTTPException(status_code=404, detail="Requested Reservation with id " + reservationId + " does not exist")
    if status == 'accepted':
        requestedreserveProperties[propertyId].remove(reservation)
        acceptedReservationProperties[propertyId].append(reservation)
        return {"message": "Reservation " + reservationId + " for property "+ propertyId + " was accepted"}
    else :
        requestedreserveProperties[propertyId].remove(reservation)
        return {"message": "Reservation "+ reservationId + " was cancelled"}
    


@router.get("/property/reserveDates/{id}", status_code=status.HTTP_200_OK)
async def get_reserve_dates_for_property(id:str, type: str):
    if type == "requested":
        if id not in requestedreserveProperties.keys():
            return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
        return {"message": requestedreserveProperties[id]}
    else:
        if id not in acceptedReservationProperties.keys():
            return HTTPException(status_code=404, detail="Property with id " + id + " does not exist")
        return {"message": acceptedReservationProperties[id]}

    



@router.get("/experiences", status_code=status.HTTP_200_OK)
async def get_experiences(owner: Optional[str] = None, typeOfExperience: Optional[str] = None): 
    ownersExperiences = filterExperienceByOwner(registeredExperiences, owner)
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