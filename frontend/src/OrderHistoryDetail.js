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
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { useLazyQuery, gql } from '@apollo/client'

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

const GET_ORDER = gql`
  query ExampleQuery($orderId: String) {
    order(orderId: $orderId) {
      id
      customerId
      customerName
      orderItem {
        itemId
        title
        author
        quantity
        unitPrice
      }
    }
  }
`

export default function OrderHistoryDetail(props) {
  const [open, setOpen] = useState(false)
  const [getOrder, { loading, error, data }] = useLazyQuery(GET_ORDER)
  
  const handleClickOpen = () => {
    setOpen(true)
    getOrder({ variables: { orderId: props.orderId } })
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (loading) return <p>Loading ...</p>
  if (error) return `Error! ${error}`

  console.log(data)
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        注文の詳細を見る
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="order-history-detail-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="sm"
      >
        <BootstrapDialogTitle id="order-history-detail-dialog-title" onClose={handleClose}>
          注文詳細
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>注文ID: {data?.order.id}</Typography>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>書籍名</TableCell>
                  <TableCell>著者名</TableCell>
                  <TableCell align="right">価格&nbsp;(円)</TableCell>
                  <TableCell>個数</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.order.orderItem.map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell>{row.author}</TableCell>
                    <TableCell align="right">{row.unitPrice}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            閉じる
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
