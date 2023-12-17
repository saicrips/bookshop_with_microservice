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

import { useLazyQuery, gql } from '@apollo/client'
import OrderHistoryDetail from './OrderHistoryDetail';

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

const GET_ORDERS = gql`
  query Book($customerId: String) {
    orders(customerId: $customerId) {
      id
      customerId
      customerName
      orderItem {
        itemId
        quantity
        unitPrice
      }
    }
  }
`

export default function OrderHistory(props) {
  const [open, setOpen] = useState(false)
  // const [quantity, setQuantity] = useState('1')
  const [getOrders, { loading, error, data, refetch }] = useLazyQuery(GET_ORDERS)

  const handleClickOpen = () => {
    setOpen(true)
    refetch()
    getOrders({ variables: { customerId: "user" } })
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (loading) return <p>Loading ...</p>
  if (error) return `Error! ${error}`
  console.log(data)

  return (
    <div>
      <Button color="inherit" onClick={handleClickOpen}>注文履歴</Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="order-history-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="sm"
      >
        <BootstrapDialogTitle id="order-history-dialog-title" onClose={handleClose}>
          注文履歴
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>注文ID</TableCell>
                <TableCell align="right">日時</TableCell>
                <TableCell>詳細を見る</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.orders?.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.date}</TableCell>
                  <TableCell align="right"><OrderHistoryDetail orderId={row.id}/></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            とじる
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
