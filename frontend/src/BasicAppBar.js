import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge';
import Cart from './Cart'
import OrderHistory from './OrderHistory'

export default function ButtonAppBar(props) {
  const keycloak = props.keycloak
  
  function logout() {
    keycloak.logout()
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bookshop Sample
        </Typography>
        <Cart cart={props.cart} />
        <OrderHistory />
        {/* <Button color="inherit" onClick={logout}>ログアウト</Button> */}
      </Toolbar>
    </AppBar>
  )
}
