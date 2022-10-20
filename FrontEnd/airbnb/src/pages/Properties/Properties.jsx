import React from 'react';
import BasicCard from './Card.js';

export const Properties = () => {
    const inmuebles = [
        {id:1, title:"Cabaña 1", owner:"pepe1", location:"CABA", rating:"1/5"},
        {id:2, title:"Cabaña 2", owner:"pepe2", location:"Tierra del Fuego", rating:"2/5"},
        {id:3, title:"Hotle 1", owner:"pepe3", location:"Cordoba", rating:"4/5"}
    ]
  
    return (
        <>
           {
                inmuebles.map(card => (
                    <BasicCard id={card.id} title={card.title} owner={card.owner} location={card.location} rating={card.rating}/>      
                ))
            }
        </>
    );
}
