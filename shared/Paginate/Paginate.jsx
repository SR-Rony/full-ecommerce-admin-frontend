'use client';
import { Pagination, Stack } from '@mui/material';
import 'react-responsive-pagination/themes/classic.css';
// 👆 classic theme, see below for other theme / css options

function Paginate({setCurrentPage,totalPages,currentPage,setInitPaginate}) {
 return <Stack spacing={2}>
      <Pagination color='primary' count={totalPages||0} page={currentPage||1}  showFirstButton showLastButton   onChange={(e,value) =>{
        // console.log(value);
        if(setInitPaginate){
          setInitPaginate(true);
        }
        setCurrentPage(value);
        
      }}/>
    </Stack>;
}

export default Paginate;
