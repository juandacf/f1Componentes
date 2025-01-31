class añadirEquipos extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/ `
        <form action="" id="myform">
            <label for="id"> ID equipo</label><input type="text" name="id"> <br>
            <label for="nombre"> Nombre Equipo</label><input type="text" name="nombre"> <br>
            <label for="pais"> pais</label><input type="text" name="pais"> <br>
            <label for="motor"> Motor</label><input type="text" name="motor"> <br>
            <label for="imagen"> Imagen</label><input type="text" name="imagen"> <br>
            <input type="submit" value="submit" class="submitButton"> 
        </form>
        `
        this.shadowRoot.querySelector("#myform").addEventListener("submit", async(e)=>{
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.target));
            data.pilotos = []
            const formattedData = JSON.stringify(data); 
            try {
                const response = await fetch("http://localhost:3000/equipos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: formattedData
                });
                console.log("Producto creado:", formattedData);
                alert("Producto agregado con éxito!");
            } catch (error) {
                console.error("Error al enviar datos:", error);
            }
        })


    }
}
// customElements.define('componente-equipos', añadirEquipos);
// <componente-equipos></componente-equipos> 


class verEquipos extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }
    async connectedCallback(){
        this.shadowRoot.innerHTML = /*html*/`
        <div id="teamList"> </div>
        `;

        await this.mostrarEquipos();
    }

    async obtenerEquipos() {
        try {
            const response = await fetch("http://localhost:3000/equipos");
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
    async mostrarEquipos(){
        const data = await this.obtenerEquipos();
        const teamContainer = this.shadowRoot.querySelector('#teamList');
        data.forEach(equipo => {
            const team = document.createElement('team-element')
            team.className = 'teamElement';
            team.innerHTML= /*html*/`
            <p> ${equipo.id}</p>
            <p>${equipo.nombre}</p>
            <p>${equipo.pais}</p>
            <p>${equipo.motor}</p>
            `
            teamContainer.appendChild(team);
        });
    }
}

// customElements.define('ver-equipos', verEquipos)



class eliminarEquipos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"})
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/`
        <form action="" id="myform">
            <label for="buscar"> Buscar</label><input type="text" id="buscarEditar"> <br>
            <label for="id"> ID equipo</label><input type="text" name="id"> <br>
            <label for="nombre"> Nombre Equipo</label><input type="text" name="nombre"disabled> <br>
            <label for="pais"> pais</label><input type="text" name="pais" disabled> <br>
            <label for="motor"> Motor</label><input type="text" name="motor" disabled> <br>
            <label for="imagen"> Imagen</label><input type="text" name="imagen" disabled> <br>
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
        let data = Object.fromEntries(new FormData(e.target))
        const teamID = data.id;
        this.deleteTeam(teamID);
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
        this.shadowRoot.querySelector('input[name="id"]').value = product.id;
        this.shadowRoot.querySelector('input[name="nombre"]').value= product.nombre;
        this.shadowRoot.querySelector('input[name="pais"]').value= product.pais;
        this.shadowRoot.querySelector('input[name="motor"]').value= product.motor;
        this.shadowRoot.querySelector('input[name="imagen"]').value= product.imagen;
    }
    clearForm(){
        this.shadowRoot.querySelector('input[name="id"]').value = "";
        this.shadowRoot.querySelector('input[name="nombre"]').value= "";
        this.shadowRoot.querySelector('input[name="pais"]').value= "";
        this.shadowRoot.querySelector('input[name="motor"]').value= "";
        this.shadowRoot.querySelector('input[name="imagen"]').value= "";
    }



    async deleteTeam(id){
        try{
            const response = await fetch(`http://localhost:3000/equipos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log(`Equipo con ID ${id} eliminado`);
                this.cargarProductos();
            } else {
                console.error(`Error al eliminar el equipo con ID ${id}`);
            }
        }catch(error){
            console.error('Error al realizar la eliminación:', error);
        }
    }
}

 customElements.define('eliminar-equipo', eliminarEquipos)

class editarEquipos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }
    async connectedCallback(){
        this.shadowRoot.innerHTML = /*html*/`
        <form id="editTeamsForm">
            <label>Buscar <input type="text" id="buscarEditar"></label>
            <label>Codigo <input type="text" name="id" disabled></label>
            <label>Nombre <input type="text" name="nombre"></label>
            <label>País <input type="text" name="pais"></label>
            <label>Motor <input type="text" name="motor"></label>
            <label>Imagen <input type="text" name="imagen"></label>
            <button type="submit">Enviar</button>
        </form>
        `
        this.shadowRoot.querySelector("#buscarEditar").addEventListener('input', async (e) => {
            let textSearch = e.target.value;
            const result = await this.buscarEquipo(textSearch);
            if(result){
                this.editForm(result);
            }else {
                this.clearForm();
            }
        });

        this.shadowRoot.querySelector("#editTeamsForm").addEventListener('submit', (e)=>{
            e.preventDefault()
            const formData = Object.fromEntries(new FormData(e.target)); 
            var teamID = this.shadowRoot.querySelector('input[name="id"]').value;
            this.actualizarData(teamID, formData)
        })
    }

    editForm(product){
        this.shadowRoot.querySelector('input[name="id"]').value = product.id;
        this.shadowRoot.querySelector('input[name="nombre"]').value = product.nombre;
        this.shadowRoot.querySelector('input[name="motor"]').value = product.motor;
        this.shadowRoot.querySelector('input[name="pais"]').value = product.pais;
        this.shadowRoot.querySelector('input[name="imagen"]').value = product.imagen;
    }

    clearForm() {
        this.querySelector('input[name="id"]').value = "";
        this.querySelector('input[name="nombre"]').value = "";
        this.querySelector('input[name="pais"]').value = "";
        this.querySelector('input[name="motor"]').value = "";
        this.querySelector('input[name="imagen"]').value = "";
    }

    async buscarEquipo(inputUsuario){
        const url = `http://localhost:3000/equipos/`;
        const response = await fetch(url);
        const data = await response.json();
        const result = data.filter(producto => producto.nombre.toLowerCase().includes(inputUsuario.toLowerCase()));
        return result.length > 0 ? result[0] : null;
    }

    async actualizarData(id,data){
        try {
            const respuesta = await fetch(`http://localhost:3000/equipos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
    
            if (!respuesta.ok) {
                throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
            } else {
                console.log("se envio la path info")
            }     
    
        } catch (error) {
            console.error('Error en la solicitud PATCH:', error.message);
        }
    };
    }

// customElements.define('editar-equipo', editarEquipos)



