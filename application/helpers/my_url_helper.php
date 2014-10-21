<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

if (!function_exists('product_categories_images')) {

    function product_categories_images($name = '') {
        return base_url() . 'uploads/categories/' . $name;
    }

}
if (!function_exists('product_images')) {

    function product_images($name = '') {
        return base_url() . 'uploads/products/' . $name;
    }

}

if(!function_exists('user_images')){
    function user_images($name = ''){
        return base_url() . 'uploads/users/' . $name;
    }
}