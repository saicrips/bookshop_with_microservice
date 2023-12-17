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
import TextField from '@mui/material/TextField'

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

const GET_BOOK = gql`
  query ExampleQuery($bookId: Int) {
    book(id: $bookId) {
      id
      title
      author
      price
    }
  }
`

export default function ProductPage(props) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const [getBook, { loading, error, data }] = useLazyQuery(GET_BOOK)
  
  const handleClickOpen = () => {
    setOpen(true)
    getBook({ variables: { bookId: props.bookId } })
    console.log(props.bookId)
    console.log(data)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const postCart = () => {
    props.cart.push({
     book: data.book,
     quantity: quantity
    })
    console.log(props.cart)
    setOpen(false)
  }

  if (loading) return <p>Loading ...</p>
  if (error) return `Error! ${error}`

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        商品ページを見る
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="sm"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          商品ページ
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>書籍名: {data?.book.title}</Typography>
          <Typography gutterBottom>著者: {data?.book.author}</Typography>
          <Typography gutterBottom>価格: {data?.book.price}</Typography>
          <TextField
            id="quantity"
            label="個数"
            defaultValue="1"
            size="small"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            閉じる
          </Button>
          <Button autoFocus onClick={postCart}>
            カートに入れる
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
