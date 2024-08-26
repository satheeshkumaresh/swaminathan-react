import React from 'react';
import MUIDataTable from "mui-datatables";

const Index = ({columns,data,options}) => {
    
    return (
        <>
            <MUIDataTable
                data={data}
                columns={columns}
                options={options}
                components
            />
           
        </>
    )
}

export default Index;