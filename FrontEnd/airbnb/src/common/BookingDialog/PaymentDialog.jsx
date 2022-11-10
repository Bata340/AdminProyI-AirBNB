import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Grid } from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import InputMask from "react-input-mask";
import "./PaymentDialog.css";

export const PaymentDialog = (props) => {


    const [openDialogBooking, setOpenDialogBooking] = React.useState(false);
    const [cardNumber, setCardNumber] = React.useState("");
    const [classCardNumber, setClassCardNumber] = React.useState("");
    const [classDNI, setClassDNI] = React.useState("");
    const [dni, setDni] = React.useState("");


    const validateFields = () => {

        let valid = true;
        if(cardNumber.length < 16){
            setClassCardNumber("error-input-class");
            valid = false;
        }else{
            setClassCardNumber("");
        }

        if(dni.length < 6){
            setClassDNI("error-input-class");
            valid = false;
        }else{
            setClassDNI("");
        }

        return valid;
    }



    const proceedPayment = async () => {
        if ( validateFields() ){
            try{
                await props.paymentFunction();
                props.setOpen(false);
                setOpenDialogBooking(true);
            }catch(e){
                console.error(e);
            }
        }
        
    }
  
    return (
      <>
        <Dialog open={props.open} onClose={() => {props.setOpen(false)}}>
          <DialogTitle>Pay {props.typeOfBooking.charAt(0).toUpperCase() + props.typeOfBooking.slice(1)}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              In order to book this {props.typeOfBooking.toLowerCase()} you have to pay with a card method:
            </DialogContentText>
            <Grid container item justifyContent="center" alignItems="center">
                <Grid item xs={12} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                    <TextField
                        id="card_number"
                        label="Card Number"
                        value={cardNumber}
                        onChange={(event) => {setCardNumber(event.target.value);}}
                        className = {classCardNumber}
                        type="number"
                        onInput = {(e) =>{
                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,16)
                        }}
                    />
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                    <TextField
                        id="dni"
                        label="D.N.I"
                        className={classDNI}
                        type="number"
                        value={dni}
                        onChange={(event) => {setDni(event.target.value);}}
                        onInput = {(e) =>{
                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,8)
                        }}
                    />
                </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.setOpen(false)}>Cancel</Button>
            <Button onClick={proceedPayment}>Pay</Button>
          </DialogActions>
        </Dialog>

        <BookingDialog showDialog={openDialogBooking} typeOfBooking={props.typeOfBooking} />
      </>
    );
}
