import ButtonAppBar from './BasicAppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Catalogue from './Catalogue'

export default function App(props) {
  const keycloak = props.keycloak
  const cart = []

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ButtonAppBar keycloak={keycloak} cart={cart}/>
      <Container>
        <Catalogue cart={cart}/>
      </Container>
    </Box>
  )
}
