import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { gql, useQuery } from '@apollo/client'
import ProductPage from './ProductPage'

const LIST_BOOKS = gql`
  query ListBooks {
    books {
      id
      title
      author
      price
    }
  }
`

export default function Catalogue(props) {
  const { loading, error, data } = useQuery(LIST_BOOKS)

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>書籍名</TableCell>
            <TableCell>著者名</TableCell>
            <TableCell align="right">価格&nbsp;(円)</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.books.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell>{row.author}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="center">
                <ProductPage bookId={row.id} cart={props.cart}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
