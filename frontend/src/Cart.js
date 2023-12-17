import * as React from 'react'
import { useState } from "react";
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { useMutation, gql } from '@apollo/client'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
}

const POST_ORDER = gql`
  mutation Mutation($input: OrderInput) {
  createOrder(input: $input)
}
`

export default function Cart(props) {
  const [open, setOpen] = useState(false)
  // const [quantity, setQuantity] = useState('1')
  const [postOrder, { loading, error, data }] = useMutation(POST_ORDER)
  
  const handleClickOpen = () => {
    setOpen(true)
    console.log(props.cart)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const clearCart = () => {
    const len = props.cart.length
    for(let i = 0; i < len; i++) {
      props.cart.pop();
    }
    setOpen(false)
  }

  const submitOrder = () => {
    postOrder({ variables: 
      {
        "input": {
          "customerId": "user",
          "customerName": "技術 太郎",
          "orderItem": props.cart.map((v) => {
            console.log(v)
            return {
              "itemId": v.book.id,
              "quantity": Number(v.quantity),
              "unitPrice": Number(v.book.price)
            }
          })
        }
      }
    })
    
    console.log(props.cart)
    const len = props.cart.length
    for(let i = 0; i < len; i++) {
      props.cart.pop();
    }
    setOpen(false)
    alert("注文しました。")
  }

  // if (loading) return <p>Loading ...</p>
  // if (error) return `Error! ${error}`

  return (
    <div>
      <Button color="inherit" onClick={handleClickOpen}>カート</Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="cart-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="sm"
      >
        <BootstrapDialogTitle id="cart-dialog-title" onClose={handleClose}>
          カート
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>書籍名</TableCell>
                <TableCell align="right">価格&nbsp;(円)</TableCell>
                <TableCell>個数</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.cart.map((row) => (
                <TableRow key={row.book.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.book.title}
                  </TableCell>
                  <TableCell align="right">{row.book.price}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={clearCart}>
            カートをクリア
          </Button>
          <Button autoFocus onClick={submitOrder}>
            注文
          </Button>
          {loading && <Button autoFocus>
            注文中
          </Button>}
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
