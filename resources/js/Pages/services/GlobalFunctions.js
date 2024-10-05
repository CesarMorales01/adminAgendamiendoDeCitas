class GlobalFunctions {
     
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }  
      
    setCookie(cname, cvalue, exdays) {
        document.cookie = cname + "=" + cvalue + "; max-age=" + exdays + ";path=/";
    }

    getFecha(){
      var fecha = new Date(); //Fecha actual
      var mes = fecha.getMonth()+1; //obteniendo mes
      var dia = fecha.getDate(); //obteniendo dia
      var ano = fecha.getFullYear(); //obteniendo año
      if(dia<10)
      dia='0'+dia; //agrega cero si el menor de 10
      if(mes<10)
      mes='0'+mes //agrega cero si el menor de 10
      return ano+"-"+mes+"-"+dia
    }

    formatFecha(fecha){
      var fecha = new Date(fecha); //Fecha actual
      var mes = fecha.getMonth()+1; //obteniendo mes
      var dia = fecha.getDate(); //obteniendo dia
      var ano = fecha.getFullYear(); //obteniendo año
      if(dia<10)
      dia='0'+dia; //agrega cero si el menor de 10
      if(mes<10)
      mes='0'+mes //agrega cero si el menor de 10
      return ano+"-"+mes+"-"+dia
    }

    formatNumber(num){
      return new Intl.NumberFormat("de-DE").format(num)
    }
    
    getFormatoFechaCo(fecha) {
      const fec = fecha.replace("-", "/")
      const date = new Date(fec)
      const optionsDate = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      return date.toLocaleDateString('es-CO', optionsDate)
    }
  
}

export default GlobalFunctions;