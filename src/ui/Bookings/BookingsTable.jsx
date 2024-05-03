import { useMemo, useState } from 'react';
import data from '../../../public/data.json';
import { EditIcon, LineIcon, NextIcon, PrevIcon } from '../Icons';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Table from '../Table/Table';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const bookings = data.bookings;
const customers = data.customers;
const igloos = data.igloos;

function BookingsTable() {
    const [data, setData] = useState(bookings);
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
	const navigate = useNavigate();

	const columns = useMemo(() => [
		{
			header: 'Igloo',
			id: bookings.id,
			accessorKey: 'iglooId',
			cell: ({ row }) => {
				const igloo = igloos.find(igloo => row.original.iglooId === igloo.id);
				return <div className="bookings-table__igloo">{igloo.name}</div>;
			},
		},
		{
			header: 'Guest',
			id: bookings.id,
			accessorKey: 'customerId',
			cell: ({ row }) => {
				const customer = customers.find(customer => row.original.customerId === customer.id);
				return (
					<div className="bookings-table__guest">
						<span className="name">
							{customer.name} {customer.surname}
						</span>
						<span className="email">{customer.email}</span>
					</div>
				);
			},
		},
		{
			header: 'Dates',
			id: bookings.id,
			accessorKey: 'checkInDate checkOutDate',
			cell: ({ row }) => {
				return (
					<div className="bookings-table__dates">{`${row.original.checkInDate} - ${row.original.checkOutDate}`}</div>
				);
			},
		},
		{
			header: 'Amount',
			id: bookings.id,
			accessorKey: 'amount',
			cell: ({ row }) => {
				return <div className="bookings-table__amount">$ {row.original.amount}</div>;
			},
		},
		{
			header: 'Status',
			id: bookings.id,
			accessorKey: 'status',
			cell: ({ row }) => {
				const hasChecked = row.original.status === 'in' || row.original.status === 'out';
				return (
					<div className={`status status__${row.original.status}`}>
						{hasChecked && 'checked '}
						{row.original.status}
					</div>
				);
			},
		},
		{
			header: '',
			accessorKey: 'id',
			className: '',
			id: bookings.id,
			cell: ({ row }) => {
				console.log(row.original.id)
				return (
					<div onClick={() => navigate(`/bookings/${row.original.id}/edit`)}>
						<EditIcon />
					</div>
				);
			},
		},
	])

	return (
		<Table data={data} columnFilters={columnFilters} pagination={pagination} setData={setData} setPagination={setPagination} columns={columns} setColumnFilters={setColumnFilters} />
	)
}

export default BookingsTable;
