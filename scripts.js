class User {
    constructor (name, email, address, phone) {
        this.data = {name, email, address, phone};
    };
    get() {
        return this.data;
    };
};

class Contacts {
    constructor () {
        // this.users = [];
        this.users = JSON.parse(localStorage.getItem('key')) || [];
    };
    
    // if (localStorage.getItem("key")!= null) { // но почему-то не работает если так написать
    async getData() {
        let self = this;
        let response = await fetch('https://jsonplaceholder.typicode.com/users');
        let result = await response.json();
        let ppp = JSON.stringify(result);
        self.users = await JSON.parse(ppp);
        self.users.forEach(element => {
            let yyy = JSON.stringify(element.address);
            element.address = yyy;
        });
        localStorage.setItem('key', JSON.stringify(self.users)); 
        contacts.setCoocie();       
    }   
    add(name, email, address, phone) {
        let user = new User(name, email, address, phone);
        let myUser = user.get();
        this.users.push({id: this.users.length, ...myUser});
        localStorage.getItem('key', JSON.stringify(this.users));
        localStorage.setItem('key', JSON.stringify(this.users));
        console.log(user.data.address)
    }
    setCoocie() {
        document.cookie = encodeURIComponent('storageExpiration') + '=' + encodeURIComponent(this.users) + '; path=/' + '; max-age = 8,64e+8';
        console.log(decodeURIComponent(document.cookie));
    }
    edit(id, name, email, address, phone) {
        this.users[id].name = name;
        this.users[id].email = email;
        this.users[id].address = address;
        this.users[id].phone = phone;

        localStorage.setItem('key', JSON.stringify(this.users));
    };
    remove(id) {
        delete this.users[id];
        localStorage.setItem('key', JSON.stringify(this.users));
    }
    get() {
        return JSON.parse(localStorage.getItem('key'));
    }
};

class ContactsApp extends Contacts {
    constructor() {
        super();
    };
    display() {
        let self = this;

        let MainBlock = document.createElement('div'),
        container = document.createElement('div'),
        name = document.createElement('p'),
        form = document.createElement('form'),
        inputName = document.createElement('input'),
        inputEmail = document.createElement('input'),
        inputAddress = document.createElement('input'),
        inputPhone = document.createElement('input'),
        ButtonBlock = document.createElement('div'),
        saveButton = document.createElement('button'),
        deleteButton = document.createElement('button');
    
        document.body.appendChild(MainBlock);
        MainBlock.classList.add('MainBlock');

        MainBlock.appendChild(container);
        container.classList.add('container');

        container.appendChild(name);
        name.classList.add('name');
        name.innerHTML = 'Список контактов';

        container.appendChild(form);
        form.classList.add('form');

        form.appendChild(inputName);
        inputName.setAttribute('type', 'text');
        inputName.setAttribute('id', 'textName');
        inputName.setAttribute('placeholder', 'Напишите имя контакта');
        inputName.required = true;

        form.appendChild(inputEmail);
        inputEmail.setAttribute('type', 'text');
        inputEmail.setAttribute('id', 'textEmail');
        inputEmail.setAttribute('placeholder', 'Напишите почту контакта');
        inputEmail.required = true;

        form.appendChild(inputAddress);
        inputAddress.setAttribute('type', 'text');
        inputAddress.setAttribute('id', 'textAddress');
        inputAddress.setAttribute('placeholder', 'Напишите адрес контакта');
        inputAddress.required = true;


        form.appendChild(inputPhone);
        inputPhone.setAttribute('type', 'text');
        inputPhone.setAttribute('id', 'textPhone');
        inputPhone.setAttribute('placeholder', 'Напишите номер контакта');
        inputPhone.required = true;


        form.appendChild(ButtonBlock);
        ButtonBlock.classList.add('ButtonBlock');

        ButtonBlock.appendChild(saveButton);
        saveButton.classList.add('saveButton');
        saveButton.innerHTML = 'Добавить';
        saveButton.setAttribute('type', 'submit');

        ButtonBlock.appendChild(deleteButton);
        deleteButton.classList.add('deleteButton');
        deleteButton.innerHTML = 'Очистить';
        deleteButton.setAttribute('type', 'reset');

		form.addEventListener('submit', (event) => {
            event.preventDefault(); // это вроде убираем перезагрузку
			let name = event.currentTarget[0].value
            let email = event.currentTarget[1].value
            let address = event.currentTarget[2].value
            let phone = event.currentTarget[3].value
            event.currentTarget[0].value = event.currentTarget[1].value = event.currentTarget[2].value = event.currentTarget[3].value = '' // здесь плейсхолдер чистим
            self.add(name, email, address, phone);
            this.displayContacts();            
        })
    }
    editModalWindow(contactId, userData) {
        let self = this;
        let {id, name, email, address, phone} = userData;
    
        let editBlock = document.getElementById(contactId)
    
        let editForm = document.createElement('div');
        editForm.classList.add('editForm');
        let inputName = document.createElement('input')
        let inputPhone = document.createElement('input')
        let inputEmail = document.createElement('input')
        let inputAddress = document.createElement('input')
    
        inputPhone.value = phone
        inputName.value = name
        inputEmail.value = email
        inputAddress.value = address
    
        editForm.appendChild(inputName)
        editForm.appendChild(inputPhone)
        editForm.appendChild(inputEmail)
        editForm.appendChild(inputAddress)
    
        editBlock.appendChild(editForm)    

        let saveChangeBut = document.createElement('button');
        saveChangeBut.classList.add('saveChangeBut');
        saveChangeBut.innerHTML = 'Сохранить';

        editForm.appendChild(saveChangeBut)

        saveChangeBut.addEventListener('click', function() {
            let newID = +contactId.replace('_', '');
        
            self.edit(newID, inputName.value, inputEmail.value, inputAddress.value, inputPhone.value);
           
            if(document.querySelector('.contactsBlock')) {
            document.querySelector('.contactsBlock').remove();
        }
        self.displayContacts();
        })
    }
    displayContacts() {
        let users = this.get;
        let self = this;

        this.users = JSON.parse(localStorage.getItem('key'));
        
        let contactsBlock = document.createElement('div');
        contactsBlock.classList.add('contactsBlock');
            
        this.users.map(user => {
            if (user == null) {
                return;
            }

            let contact = document.createElement('div');
            contact.classList.add('contact');
            let CONTACT_ID = '_' + user.id;
            contact.id = CONTACT_ID; // это мы тут диву contact присваиваем id состоящий из имена и номер индекса

            contact.innerHTML = `
                name: ${user.name} <br>
                phone: ${user.phone} <br>
                email: ${user.email} <br>
                address: ${user.address}
                `;

            let remEdButoonBlock = document.createElement('div');
            remEdButoonBlock.classList.add('remEdButoonBlock');
            contact.appendChild(remEdButoonBlock);

            let removeBut = document.createElement('button');
            removeBut.classList.add('removeBut')
            removeBut.innerHTML = 'Удалить'
            removeBut.addEventListener('click', () => {
                self.remove(user.id)
                if(document.querySelector('.contactsBlock')) {
                    document.querySelector('.contactsBlock').remove();
                }
                self.displayContacts()
            })
            remEdButoonBlock.appendChild(removeBut)

            let editBut = document.createElement('button');
            editBut.classList.add('editBut');
            editBut.innerHTML = 'Изменить';
            editBut.addEventListener('click', () => {
                editBut.remove();
                this.editModalWindow(CONTACT_ID, user)
            })
            remEdButoonBlock.appendChild(editBut)  

            if(document.querySelector('.contactsBlock')) {
            document.querySelector('.contactsBlock').remove();
            }

            document.querySelector('.container').appendChild(contactsBlock);
            contactsBlock.appendChild(contact);
        })


       


        setTimeout(() => {
            localStorage.clear();
        }, 8.64e+8)
    }
    get() {
        return this;
    };
};

let contactsApp = new ContactsApp();
contactsApp.display();
let contacts = new Contacts;
contacts.getData();
