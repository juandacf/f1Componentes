class añadirPilotos extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback(){
        this.shadowRoot.innerHTML= /*html*/`
        <form action="" id="myform">
        <label for="idEquipo"> ID equipo</label><input type="text" name="idEquipo"> <br>
        <label for="nombreEquipo"> Nombre Equipo</label><input type="text" name="nombre"> <br>
        <label for="pais"> pais</label><input type="text" name="pais"> <br>
        <label for="motor"> Motor</label><input type="text" name="motor"> <br>
        <label for="imagen"> Imagen</label><input type="text" name="imagen"> <br>
        <input type="submit" value="submit" class="submitButton"> 
    </form>
        `
    }
}

customElements.define('añadir-pilotos', añadirPilotos)