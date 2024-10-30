<?php
/*
Plugin Name: Consultar CNPJ
Description: Um simples consultor de CNPJ, porém eficaz.
Version: 1.0.0
License: MIT
Author: Consultar CNPJ
Author URI: https://consultarcnpj.com.br/
 */
class ConsultarCnpj {
    public static function init()
    {
        add_action('wp_enqueue_scripts', array('ConsultarCnpj', 'theme_scripts'));
    }
    public static function theme_scripts()
    {
        wp_enqueue_style('consultar-cnpj-bootstrap', plugins_url('/assets/css/bootstrap.min.css', __FILE__));
        wp_enqueue_style('consultar-cnpj-font-awesome', plugins_url('/assets/css/font-awesome.min.css', __FILE__));
        wp_register_script('consultar-cnpj-bootstrap', plugins_url('/assets/js/bootstrap.min.js', __FILE__), array('jquery'), '', true);
        wp_register_script('consultar-cnpj-mask', plugins_url('/assets/js/jquery.mask.min.js', __FILE__), array('jquery'), '', true);
        wp_register_script('consultar-cnpj-script', plugins_url('/assets/js/scripts.js', __FILE__), array('jquery'), '', true);
        wp_enqueue_script('consultar-cnpj-bootstrap');
        wp_enqueue_script('consultar-cnpj-mask');
        wp_enqueue_script('consultar-cnpj-script');
    }
    public static function render()
    {
        ob_start();
        include 'templates/form.phtml';
        return ob_get_clean();
    }
}

add_filter('init', array('ConsultarCnpj', 'init'));
add_shortcode('CONSULTAR_CNPJ', array('ConsultarCnpj', 'render'));
