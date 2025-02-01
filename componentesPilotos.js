class añadirPilotos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/`
        <form action="" id="myform">
        <label for="nombreEquipo"> Buscar</label><input type="text" id="buscarEditar" > <br>
        <label for="idEquipo"> ID equipo</label><input type="text" disabled id="idEquipo" disabled> <br>
        <label for="nombreEquipo"> Nombre Equipo</label><input type="text" id="nombreEquipo" disabled > <br>
        <label for="idPiloto"> ID Piloto</label><input type="text" name="id"> <br>
        <label for="motor"> Nombre Piloto:</label><input type="text" name="nombre"> <br>
        <label for="imagen"> imagen</label><input type="text" name="imagen"> <br>
        <label for="rol"> Rol</label><input type="text" name="rol"> <br>
        <input type="submit" value="submit" class="submitButton">
    </form>
        `
        this.shadowRoot.querySelector("#buscarEditar").addEventListener('input', async (e)=>{
            let textSearch = e.target.value;
            const result = await this.buscarEquipo(textSearch);
            if(result){
                this.editForm(result);
            }else {
                this.clearForm();
            }
        })

        this.shadowRoot.querySelector("#myform").addEventListener('submit', async (e)=>{
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.target));
            const teamID = this.shadowRoot.querySelector("#idEquipo").value;
            const formattedData = JSON.stringify(data);
            try{
                const response = await fetch(`http://localhost:3000/equipos/${teamID}/`);
                const responseFormatted = await response.json();
                var pilotos = responseFormatted.pilotos;
                pilotos.push(data)
                var finalData = {"pilotos": pilotos};
                fetch(`http://localhost:3000/equipos/${teamID}`,{ 
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(finalData),}
                )
            }catch(error){
                console.error(error)
            }
        })
    }

    async buscarEquipo(inputUsuario){
        const url = `http://localhost:3000/equipos/`;
        const response = await fetch(url);
        const data = await response.json();
        const result = data.filter(producto => producto.nombre.toLowerCase().includes(inputUsuario.toLowerCase()));
        return result.length > 0 ? result[0] : null;
    }

    editForm(product){
        this.shadowRoot.querySelector("#idEquipo").value = product.id;
        this.shadowRoot.querySelector("#nombreEquipo").value= product.nombre;
    }
    clearForm(){
        this.shadowRoot.querySelector("#idEquipo").value = "";
        this.shadowRoot.querySelector("#nombreEquipo").value= "";
    }
}

customElements.define('añadir-pilotos', añadirPilotos)

class verPilotos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"})
    }

    connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/ `
        <label for="buscar"> Buscar</label><input type="text" id="buscarEditar"> <br>
        <label for="id"> ID equipo</label><input id="idEquipo"type="text" name="id"disabled> <br>
        <label for="nombre"> Nombre Equipo</label><input id="nombreEquipo" type="text" name="nombre"disabled> <br>
        <button id="submitButton"> buscar</button>
        <div class= "pilotContainer"> </div>
        
        `

        this.shadowRoot.querySelector("#buscarEditar").addEventListener('input', async (e)=>{
            let textSearch = e.target.value;
            console.log(textSearch)
            const result = await this.buscarEquipo(textSearch);
            if(result){
                this.editForm(result);
            }else {
                this.clearForm();
            }
        })
        this.shadowRoot.querySelector("#submitButton").addEventListener("click", async ()=>{
            var teamID = this.shadowRoot.querySelector('#idEquipo').value;
            var dataTeam = await this.obtenerEquipos(teamID);
            const pilotos = dataTeam.pilotos;
            pilotos.forEach(piloto=> {
                const pilotContainer = this.shadowRoot.querySelector(".pilotContainer");
                const pilotCard = document.createElement("div")
                pilotCard.innerHTML = /*html*/`
                <p> ${piloto.id}</p>
                <p> ${piloto.nombre}</p>
                <p> ${piloto.imagen}</p>
                <p> ${piloto.rol}</p>
                `
                pilotContainer.appendChild(pilotCard)
            })
            this.shadowRoot.querySelector("#submitButton").disabled = true;    //Esta es una forma de fixear para que no se reproduzcan las tarjetas de pilotos ilimitadamente. 
        }   
    )
    }
    async obtenerEquipos(id) {
        try {
            const response = await fetch(`http://localhost:3000/equipos/${id}`);
            if(!response.ok){
                throw new Error('No se pudieron obtener los equipos')
            }
            return await response.json()
        }
        catch (error){
            console.error(error);
            return []
            
        }
    }
    async buscarEquipo(inputUsuario){
        const url = `http://localhost:3000/equipos/`;
        const response = await fetch(url);
        const data = await response.json();
        const result = data.filter(producto => producto.nombre.toLowerCase().includes(inputUsuario.toLowerCase()));
        return result.length > 0 ? result[0] : null;
    }

     editForm(product){
        this.shadowRoot.querySelector('#idEquipo').value =  product.id;
        this.shadowRoot.querySelector('#nombreEquipo').value = product.nombre;
    }

    clearForm() {
        this.shadowRoot.querySelector('"#idEquipo').value = "";
        this.shadowRoot.querySelector('#nombreEquipo').value = "";
    }

    
}
customElements.define('ver-pilotos', verPilotos)



class eliminarPilotos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"})
    }

    connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/ `
        <label for="buscar"> Buscar</label><input type="text" id="buscarEditar"> <br>
        <label for="id"> ID equipo</label><input id="idEquipo"type="text" name="id"disabled> <br>
        <label for="nombre"> Nombre Equipo</label><input id="nombreEquipo" type="text" name="nombre"disabled> <br>
        <button id="submitButton"> buscar</button>
        <div class= "pilotContainer"> </div>
        
        `
        
        this.shadowRoot.querySelector("#buscarEditar").addEventListener('input', async (e)=>{
            let textSearch = e.target.value;
            const result = await this.buscarEquipo(textSearch);
            if(result){
                this.editForm(result);
            }else {
                this.clearForm();
            }
        })
        this.shadowRoot.querySelector("#submitButton").addEventListener("click", async ()=>{
            var teamID = this.shadowRoot.querySelector('#idEquipo').value;
            var dataTeam = await this.obtenerEquipos(teamID);
            const pilotos = dataTeam.pilotos;
            pilotos.forEach(piloto=> {
                const pilotContainer = this.shadowRoot.querySelector(".pilotContainer");
                const pilotCard = document.createElement("div")
                pilotCard.setAttribute("id",`-${piloto.id}`)
                pilotCard.innerHTML = /*html*/`
                <p> ${piloto.id}</p>
                <p> ${piloto.nombre}</p>
                <p> ${piloto.imagen}</p>
                <p> ${piloto.rol}</p>
                <button id='${piloto.id}' class='deleteBtn' > Eliminar </button>
                `
                pilotContainer.appendChild(pilotCard)
            })
            this.shadowRoot.querySelector("#submitButton").disabled = true;    //Esta es una forma de fixear para que no se reproduzcan las tarjetas de pilotos ilimitadamente. 
            this.deleteItems(teamID)
        }   
    )
    }
    async obtenerEquipos(id) {
        try {
            const response = await fetch(`http://localhost:3000/equipos/${id}`);
            if(!response.ok){
                throw new Error('No se pudieron obtener los equipos')
            }
            return await response.json()
        }
        catch (error){
            console.error(error);
            return []
            
        }
    }
    async buscarEquipo(inputUsuario){
        const url = `http://localhost:3000/equipos/`;
        const response = await fetch(url);
        const data = await response.json();
        const result = data.filter(producto => producto.nombre.toLowerCase().includes(inputUsuario.toLowerCase()));
        return result.length > 0 ? result[0] : null;
    }

     editForm(product){
        this.shadowRoot.querySelector('#idEquipo').value =  product.id;
        this.shadowRoot.querySelector('#nombreEquipo').value = product.nombre;
    }

    clearForm() {
        this.shadowRoot.querySelector('"#idEquipo').value = "";
        this.shadowRoot.querySelector('#nombreEquipo').value = "";
    }

    async deleteItems(teamID){
        var deteteButtons = this.shadowRoot.querySelectorAll(".deleteBtn");
        deteteButtons.forEach(button=>
            button.addEventListener("click", async ()=>{
                const pilotID = button.id;
                const cardID = `-${button.id}`;
                try{
                    const response = await fetch(`http://localhost:3000/equipos/${teamID}/`)
                    const responseFormatted = await response.json();
                    var pilotos = responseFormatted.pilotos;
                    pilotos.forEach((piloto, index)=>{
                        if(piloto.id==pilotID){
                            pilotos.splice(index, 1)
                        }
                    })
                    var finalData = {"pilotos": pilotos};
                    fetch(`http://localhost:3000/equipos/${teamID}`,{ 
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(finalData),}
                )
                }catch(error){
                    console.error(error);
                }

                this.shadowRoot.getElementById(cardID).remove();


            })            
        )
        
    }

    }
customElements.define('eliminar-pilotos', eliminarPilotos)

class editarPilotos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"})
    }

    connectedCallback(){
        this.shadowRoot.innerHTML = /*html*/ `
        <label>Buscar Equipo<input type="text" id="buscarEquipo"></label><br>  
        <label>Codigo Equipo: <input type="text" id="idEquipo" disabled></label><br>
        <label>Nombre Equipo: <input type="text" id="nombreEquipo" disabled></label><br>
        <label>BuscarJugador <input type="text" id="buscarJugador"></label><br>
        <form id="myForm">
        <label>Codigo Jugador: <input type="text" id="codigoPiloto" name="id" disabled></label><br>
        <label>Nombre Jugador: <input type="text" id="nombrePiloto" name="nombre"></label><br>
        <label> Imagen Jugador: <input type="text" id="imagenPiloto" name="imagen"></label><br>
        <label> Rol Jugador: <input type="text" id="nombreRol" name="rol"></label><br>
        <input type="submit" value="submit" class="submitButton">
        </form>
        `
        this.shadowRoot.querySelector("#buscarEquipo").addEventListener('input', async (e)=>{
            let textSearch = e.target.value;
            const result = await this.buscarEquipo(textSearch);
            if(result){
                this.editTeam(result);
            }else {
                this.clearTeam();
            }
        })

        this.shadowRoot.querySelector("#buscarJugador").addEventListener('input', async (e)=>{
            let textSearch = e.target.value;
            const ID= this.shadowRoot.querySelector('#idEquipo').value 
            const result = await this.buscarPilotos(textSearch, ID)
            if(result){
                this.editPilots(result);
            } else {
                this.clearPilots();
            }
            
        })
        this.shadowRoot.querySelector('#myForm').addEventListener('submit', async(e)=>{
            e.preventDefault()
            const ID= this.shadowRoot.querySelector('#idEquipo').value
            let dataForm = Object.fromEntries(new FormData(e.target));
            console.log(dataForm)
            try{
                const pilotId = this.shadowRoot.querySelector('#codigoPiloto').value;
                const response = await fetch(`http://localhost:3000/equipos/${ID}/`)
                const responseFormatted = await response.json();
                var pilotos = responseFormatted.pilotos;
                    pilotos.forEach(piloto=>{
                        if(piloto.id==pilotId){
                            piloto.nombre = dataForm.nombre;
                            piloto.imagen = dataForm.imagen;
                            piloto.rol = dataForm.rol;
                        }
                    })
                var finalData = {"pilotos": pilotos};
                fetch(`http://localhost:3000/equipos/${ID}`,{ 
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(finalData),}
                    )
            }catch(error){
                console.error(error);
            }
            
        })
    }
    editTeam(product){
        this.shadowRoot.querySelector('#idEquipo').value =  product.id;
        this.shadowRoot.querySelector('#nombreEquipo').value = product.nombre;
    }

    clearTeam() {
        this.shadowRoot.querySelector('"#idEquipo').value = "";
        this.shadowRoot.querySelector('#nombreEquipo').value = "";
    }
    editPilots(pilot){
        this.shadowRoot.querySelector('#codigoPiloto').value= pilot.id;
        this.shadowRoot.querySelector('#nombrePiloto').value= pilot.nombre;
        this.shadowRoot.querySelector('#imagenPiloto').value= pilot.imagen;
        this.shadowRoot.querySelector('#nombreRol').value= pilot.rol;
    }
    clearPilots(){
        this.shadowRoot.querySelector('#codigoPiloto').value= "";
        this.shadowRoot.querySelector('#nombrePiloto').value= "";
        this.shadowRoot.querySelector('#imagenPiloto').value= "";
        this.shadowRoot.querySelector('#nombreRol').value = "";
    }

    async buscarEquipo(inputUsuario){
        const url = `http://localhost:3000/equipos/`;
        const response = await fetch(url);
        const data = await response.json();
        const result = data.filter(producto => producto.nombre.toLowerCase().includes(inputUsuario.toLowerCase()));
        return result.length > 0 ? result[0] : null;
    }

    async buscarPilotos(inputUsuario, id){
        const url = `http://localhost:3000/equipos/${id}`;
        const response = await fetch(url);
        const data = await response.json();
        const pilotos = data.pilotos
        const result = pilotos.filter(piloto => piloto.nombre.toLowerCase().includes(inputUsuario.toLowerCase()));
        return result.length > 0 ? result[0] : null;
        
    }
}
customElements.define('editar-pilotos', editarPilotos)