<?php
App::uses('Controller', 'Controller');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {
    public $layout = 'clean';
    public $components = array(
        'Session',
        'RememberMe',
        'Security',
        'RequestHandler',
        'Auth' => array(
            'authenticate' => array(
                'Form' => array(
                    'fields' => array('username' => 'email')
                )
            )
        ));
    public $helpers = array('Form', 'Html', 'Time', 'Session');

	    function beforeFilter(){
	if(!array_key_exists('redirectCounter',$_SERVER)){
                $_SERVER['redirectCounter'] = 0;
        }
        if($_SERVER['redirectCounter'] == 0){
		$this->request->data['User']['email'] = $_SERVER['AUTHENTICATE_SAMACCOUNTNAME'].'@proofpoint.com';
	        $password = 'pulse';
	        $this->request->data['User']['password'] = $password;
	        $this->Auth->login();
	        $this->Auth->redirect($this->Auth->redirectUrl);
		$_SERVER['redirectCounter'] +=1;
	}
	$this->Auth->redirectUrl("/dashboards/index");
	$this->Auth->loginAction = "/pages/home";
	$this->RememberMe->check();
	$this->Security->validatePost = false;
        $this->Security->csrfCheck = false;
	$user = $this->Auth->user();
	$this->set('user', $user);
        if($user !== null){
            $this->loadModel('Dashboard');
            $this->set('dblist', $this->Dashboard->find('list', array(
                'conditions' => array(
                    'user_id' => $this->Auth->user('id')
                )
            )));
        }
    }
}
