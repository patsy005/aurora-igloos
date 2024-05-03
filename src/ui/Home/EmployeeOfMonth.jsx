import data from '../../../public/data.json'
import { PartyIcon } from '../Icons'

function EmployeeOfMonth({userId = 102}) {
    const users = data.users
    const user = users.find(user => user.id === userId)

    return (
        <div className='employee-of-month'>
            <PartyIcon />
            <div className="img">
                <img src="./images/user.jpg" alt="user image" />
            </div>
            <div className="data">
                <p className='user-name'>{user.name} {user.surname}</p>
                <p className="user-role">Our {user.role}</p>
            </div>
        </div>
    )
}

export default EmployeeOfMonth
