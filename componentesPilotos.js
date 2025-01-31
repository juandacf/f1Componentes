class añadirPilotos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/`
        <form action="" id="myform">
        <label for="nombreEquipo"> Buscar</label><input type="text" id="buscarEditar" > <br>
        <label for="idEquipo"> ID equipo</label><input type="text" disabled id="idEquipo" > <br>
        <label for="nombreEquipo"> Nombre Equipo</label><input type="text" id="nombreEquipo" disabled > <br>
        <label for="idPiloto"> ID Piloto</label><input type="text" name="id"> <br>
        <label for="motor"> Nombre Piloto:</label><input type="text" name="nombre"> <br>
        <label for="imagen"> Equipo</label><input type="text" name="rol"> <br>
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