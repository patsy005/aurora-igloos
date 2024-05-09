import { useState } from 'react';
import data from '../../../public/data.json';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import Table from '../Table/Table';
import { DeleteIcon, EditIcon, ViewIcon } from '../Icons';

const customers = data.customers;
const bookings = data.bookings;
const igloos = data.igloos;

function CustomersTable() {
    const [data, setData] = useState(customers);
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const navigate = useNavigate();

    const columns = useMemo(() => [
        {
            header: 'Name',
            id: customers.id,
            accessorKey: 'name',
            cell: ({ row }) => {
                return (
                    <div className="bookings-table__guest">
                        <span className="name">
                            {row.original.name} {row.original.surname}
                        </span>
                        <span className="email">{row.original.email}</span>
                    </div>
                );
            },
        },
        {
            header: 'Phone',
            id: customers.id,
            accessorKey: 'phone',
            cell: ({ row }) => {
                return <div className="customers-table__phone">{row.original.phoneNumber}</div>;
            },
        },
        {
            header: 'Nationality',
            id: customers.id,
            accessorKey: 'nationality',
            cell: ({ row }) => {
                return <div className="customers-table__nationality">{row.original.nationality}</div>;
            },
        },
        {
            header: 'Bookings',
            id: customers.id,
            accessorKey: 'bookings',
            cell: ({ row }) => {
                const customerBookingId = bookings.find(booking => booking.customerId === row.original.id).id;
                return (
                    <div className="igloos-table__actions">
                        <span onClick={() => navigate(`/booking/${customerBookingId}`)}>
                            <ViewIcon />
                        </span>
                    </div>
                );
            },
        },
        {
			header: 'Status',
			id: customers.id,
			accessorKey: 'status',
			cell: ({ row }) => {
                const bookingStatus = bookings.find(booking => booking.customerId === row.original.id).status;
				const hasChecked = bookingStatus === 'in' || row.original.status === 'out'
				return (
					<div className={`status status__${bookingStatus}`}>
						{hasChecked && 'checked '}
						{bookingStatus}
					</div>
				)
			},
		},
		{
			header: '',
			accessorKey: 'id',
			className: '',
			id: customers.id,
			cell: ({ row }) => {
				return (
					<div className="bookings-table__actions">
						<span onClick={() => navigate(`/customer/${row.original.id}/edit`)}>
							<EditIcon />
						</span>
						<span>
							<DeleteIcon />
						</span>
					</div>
				)
			},
		},
    ]);
    return (
        <Table
            className={'customers-table'}
            data={data}
            columnFilters={columnFilters}
            pagination={pagination}
            setData={setData}
            setPagination={setPagination}
            columns={columns}
            setColumnFilters={setColumnFilters}
        />
    );
}

export default CustomersTable;
