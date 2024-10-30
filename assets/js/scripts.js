function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}



jQuery(document).ready(function($){
    $(document).ajaxStart(function () {
        $('#loading').show();
    }).ajaxStop(function () {
        $('#loading').hide();
    });
    $(".cnpj").focus(function(){
        //$("#result").hide();
    });
    // mask it
    $('.cnpj').mask('00.000.000/0000-00', { reverse: true });
    $('#form-consultar-cnpj').submit(function(e){   
        e.preventDefault();         
        var cnpj = $('.cnpj').val();
        if(cnpj.length == 0 ) {
            alert('Preencha o CNPJ!');
            return false;
        }
        cnpj = cnpj.replace(/\D/g, "");
        var api_url = "https://www.receitaws.com.br/v1/cnpj/"+cnpj;
        if(validarCNPJ(cnpj)) { 
            $('#result').hide();           
            $.ajax({
                url: api_url,
                dataType: "JSONP",
                type: 'GET',
                success: function (result) {                   
                    if(result.status == 'OK') {        
                        var html;               
                        var date = new Date(result.ultima_atualizacao);        
                        var day = parseInt(date.getDate()) < 10 ? "0" + (date.getDate()) : date.getDate();                
                        var month = parseInt(date.getMonth()) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                        var ultima_atualizacao = day + '/' + month + '/' +date.getFullYear();

                        var atividades = "";
                        result.atividade_principal.forEach((v,k)=>{
                            atividades += `<tr>
                                            <td>${v.code}</td>
                                            <td colspan="3">${v.text}</td>
                                            </tr>`; 
                        });

                        var atividades_secundarias = "";
                        result.atividades_secundarias.forEach((v, k) => {
                            atividades_secundarias += `<tr>
                                            <td>${v.code}</td>
                                            <td colspan="3">${v.text}</td>
                                            </tr>`;
                        });

                        var socios = "";
                        result.qsa.forEach((v,k)=>{
                            socios += ` <tr>
                                            <td colspan="3">${v.nome}</td>
                                            <td>${v.qual}</td>
                                        </tr>`;
                        });

                        html = `<h2 class="p-0 m-0 text-uppercase text-center">${result.nome}</h2>
                                <h5 class="p-0 m-0 text-center">${result.cnpj}</h5>
                                <table class="table table-striped table-bordered mt-3">
                                    <tr>
                                        <th colspan="4">Última Atualização</th>                    
                                    </tr>
                                    <tr>
                                        <td colspan="4">${ultima_atualizacao}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="3">Número de inscrição</th>  
                                        <th>Data de abertura</th>                   
                                    </tr>
                                    <tr>
                                        <td colspan="3">${result.cnpj} - ${result.tipo}</td>
                                        <td>${result.abertura}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4">Nome empresarial</th>
                                    </tr>
                                    <tr>
                                        <td colspan="4">${result.nome}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4">Nome fantasia</th>
                                    </tr>
                                    <tr>
                                        <td colspan="4">${result.fantasia}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4">Atividade econômica primária</th>
                                    </tr>
                                    <tr>
                                        <th>Código</th>
                                        <th colspan="3">Descrição</th>
                                    </tr>
                                    ${atividades}
                                    <tr>
                                        <th colspan="4">Atividades econômicas secundárias</th>
                                    </tr>
                                    ${atividades_secundarias}
                                    <tr>
                                        <th colspan="4">Código e descrição da natureza jurídica</th>
                                    </tr>
                                    <tr>
                                        <td colspan="4">${result.natureza_juridica}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Logradouro</th>
                                        <th>Número</th>
                                        <th>Complemento</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">${result.logradouro}</td>
                                        <td>${result.numero}</td>
                                        <td>${result.complemento}</td>
                                    </tr>
                                    <tr>
                                        <th>CEP</th>
                                        <th>Bairro</th>
                                        <th>Município</th>
                                        <th>UF</th>
                                    </tr>
                                    <tr>
                                        <td>${result.cep}</td>
                                        <td>${result.bairro}</td>
                                        <td>${result.municipio}</td>
                                        <td>${result.uf}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="2">Endereço eletrônico</th>
                                        <th colspan="2">Telefone</th>                   
                                    </tr>
                                    <tr>
                                        <td colspan="2">${result.email ? result.email : "-"}</td>
                                        <td colspan="2">${result.telefone ? result.telefone : "-"}</td>                   
                                    </tr>
                                    <tr>
                                        <th colspan="4">Capital social</th>
                                    </tr>
                                    <tr>
                                        <td colspan="4">${result.capital_social}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4">Quadro de sócios e administradores</th>
                                    </tr>  
                                    <tr>
                                        <th colspan="3">Nome</th>
                                        <th>Qualificação</th>
                                    </tr>                                  
                                    ${socios}
                                    <tr>
                                        <th colspan="2">Situação cadastral</th>
                                        <th colspan="2">Data da situação cadastral</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">${result.situacao}</td>
                                        <td colspan="2">${result.data_situacao}</td>
                                    </tr>
                                    <tr>
                                        <th colspan="4">Motivo da Situação Cadastral</th>
                                    </tr>
                                    <tr>
                                        <td colspan="4">${result.motivo_situacao ? result.motivo_situacao : '-'}</td>
                                    </tr>
                                </table>`;
                        $('#result').html(html);
                        $('#result').fadeIn('slow'); 
                    }
                    else {
                        $("#result").html(`<div class="alert alert-danger">
                                            <h3 class="p-0 m-0 text-center"> CNPJ não encontrado! </h3>
                                          </div>`);
                        $("#result").fadeIn("slow"); 
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });            
        }
        else {
            alert('CNPJ inválido!');            
        }
    });
});