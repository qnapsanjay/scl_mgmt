<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Home extends My_Controller {

  public function index() {
    $this->data['title'] = 'Home';
    $this->data['inc_page'] = "home/index";
    $this->load->view('layout', $this->data);
  }

}

/* End of file home.php */
/* Location: ./application/controllers/home.php */