import React, {useState, useEffect} from 'react';

const gitHubUrl = 'https://api.github.com/users';
const searchUserUrl = 'https://api.github.com/search/users';

const Users = () => {
    const [users,setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [usersProfile,setUsersProfile] = useState([]);
    const [data,setData] =useState(true);

    const getUsers = async() => {
        const res = await fetch(gitHubUrl);
        const users = await res.json();
        setUsers(users);
        console.log(users);
    }

    const getUsersProfile = async(userName) => {
        const res = await fetch(`${gitHubUrl}/${userName}`);
        const usersProfile = await res.json();
        setUsersProfile(usersProfile);
    }
    
    const searchedUser = async(searchUser) => {
        const res = await fetch(`${searchUserUrl}?q=${searchUser}`);
        const calledUser = await res.json();
        const fetchUser = calledUser.items;
        setUsers(fetchUser);
        getUsersProfile(fetchUser[0].login);
        setData(false);
    }

    useEffect( () => {
        if(data){
            getUsers();
        }else {
            searchedUser();    
        }
    },[]);

    const submit = (e) => {
        searchedUser(searchUser);
        setSearchUser('');
    };

    const changeUser = (e) => {
        setSearchUser('');
        setSearchUser(e.target.value);
    };

    const seeDetails = async(id) => {
        const res = await fetch(`${'https://api.github.com/user'}/${id}`);
        const a = await res.json();
        const fetchUser = a;
        setUsers(fetchUser);
        setUsersProfile(fetchUser);
    };

    return (
    <>
        <input type='text' className='search' onChange={changeUser} value={searchUser} placeholder='Search User'/>
        <button className='btn' onClick={submit}>Submit</button>
        <ul className='users'>
            {users.length >= 2 ? 
            <>
                {users.map((user) => {
                    const {id,login,avatar_url} = user;
                    return (
                     <li key={id}>
                        <img src={avatar_url} alt = 'user'/>
                        <div>
                        <h3>{login}</h3>
                        <button  className='btn' onClick={() => {seeDetails(id)}}>Summary</button>
                        </div>
                     </li>
                    );
                })} 
            </>
            : <>
                {
                     <li key={users.id} className=' user-profile'>
                        <img src={users.avatar_url} alt = 'user'/>
                        <ul className='details'>
                        <li >
                        <h3 >{usersProfile.name}</h3>
                        <a href={users.html_url}>Github</a>
                        </li>
                        <li >
                        <label >Login name</label>
                        <p >{users.login}</p>
                        </li>
                        <li>
                        <label >Location</label>
                       <p >{usersProfile.location}</p>
                       <label >Repo</label>
                       <p >{usersProfile.public_repos}</p>
                        </li>
                        <li >
                       <label >Created</label>
                       <p >{ new Date(usersProfile.created_at).toLocaleDateString('en-CA')}</p>
                        </li>
                        <li >
                       <label >Blog</label>
                       <p >{usersProfile.blog}</p>
                        </li>
                        </ul>
                     </li>
                    }
            </>
            }
        </ul>
        <div>
        <button className='btn' onClick={() => {getUsers()}}> Back</button>
        </div>
    </>
    );
};

export default Users;