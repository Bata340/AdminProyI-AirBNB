import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
    Button, TextField, Grid, Typography } from "@mui/material";
import { BookingDialog } from "./BookingDialog";
import InputMask from "react-input-mask";
import "./PaymentDialog.css";

export const PaymentDialog = (props) => {


    const [openDialogBooking, setOpenDialogBooking] = React.useState(false);
    const [cardNumber, setCardNumber] = React.useState("");
    const [classCardNumber, setClassCardNumber] = React.useState("");
    const [classDNI, setClassDNI] = React.useState("");
    const [dni, setDni] = React.useState("");
    const [cvv, setCvv] = React.useState("");
    const [classCVV, setClassCVV] = React.useState("");
    const [month, setMonth] = React.useState("");
    const [classMonth, setClassMonth] = React.useState("");
    const [year, setYear] = React.useState("");
    const [classYear, setClassYear] = React.useState("");


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

        if(cvv.length < 3){
            setClassCVV("error-input-class");
            valid = false;
        }else{
            setClassCVV("");
        }

        if(parseInt(month) > 12 || month == ""){
            setClassMonth("error-input-class");
            valid = false;
        }else{
            setClassMonth("");
        }

        const currentYear = parseInt(new Date().getFullYear().toString().substr(2,2));
        if(parseInt(year) > 99 || year == "" || parseInt(year) < currentYear){
            setClassYear("error-input-class");
            valid = false;
        }else{
            setClassYear("");
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
                <Grid item container xs={12} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                    <Grid item container xs={6} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                        <Grid item container xs={8} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                            <TextField 
                                id="cvv"
                                label="CVV"
                                className={classCVV}
                                type="number"
                                value={cvv}
                                onChange={(event) => {setCvv(event.target.value);}}
                                onInput = {(e) =>{
                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container xs={6} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                        <Grid item xs={5} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                        <TextField 
                            id="month"
                            label="MM"
                            className={classMonth}
                            type="number"
                            value={month}
                            onChange={(event) => {
                                let monthVal = event.target.value;
                                if (parseInt(event.target.value) > 12){
                                    monthVal = "12";
                                }
                                setMonth(monthVal);
                            }}
                            onInput = {(e) =>{
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
                            }}
                        />
                        </Grid>
                        <Grid item xs={2} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                            <Typography>/</Typography>
                        </Grid>
                        <Grid item xs={5} justifyContent="center" alignItems="center" style={{textAlign:"center", marginTop:"1rem"}}>
                        <TextField 
                            id="year"
                            label="YY"
                            className={classYear}
                            type="number"
                            value={year}
                            onChange={(event) => {setYear(event.target.value);}}
                            onInput = {(e) =>{
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
                            }}
                        />
                        </Grid>
                    </Grid>
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
