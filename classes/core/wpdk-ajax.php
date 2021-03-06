<?php
/// @cond private

if ( wpdk_is_ajax() ) {

  /**
   * Ajax class for extends an Ajax parent class.
   * You will use this class to extends a your own Ajax gateway class.
   *
   *     class YouClass extends WPDKAjax {}
   *
   * In this way you can access to `registerActions` method
   *
   * @class              WPDKAjax
   * @author             =undo= <info@wpxtre.me>
   * @copyright          Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
   * @date               2013-10-29
   * @version            1.0.1
   * @since              0.7.5
   *
   */
  class WPDKAjax extends WPDKObject {

    /**
     * Override version
     *
     * @brief Version
     *
     * @var string $version
     */

    public $version = '1.0.1';

    /**
     * Create an instance of WPXCleanFixAjax class
     *
     * @brief Construct
     *
     * @return WPXCleanFixAjax
     */
    public function __construct()
    {
      $this->registerActions();
    }

    /**
     * Register the allow ajax method in WordPress environment
     *
     * @brief Register the ajax methods
     *
     */
    public function registerActions()
    {
      $actions = $this->actions();
      foreach ( $actions as $method => $nopriv ) {
        add_action( 'wp_ajax_' . $method, array( $this, $method ) );
        if ( $nopriv ) {
          add_action( 'wp_ajax_nopriv_' . $method, array( $this, $method ) );
        }
      }
    }

    /**
     * Useful static method to add an action ajax hook
     *
     * @brief Add an Ajax hook
     * @since 1.3.0
     *
     * @param string   $method   Method name, eg: wpxkk_action_replace
     * @param callback $callable A callable function/method hook
     * @param bool     $nopriv   Set to TRUE for enable no privilege
     */
    public static function add( $method, $callable, $nopriv = false )
    {
      add_action( 'wp_ajax_' . $method, $callable );
      if ( $nopriv ) {
        add_action( 'wp_ajax_nopriv_' . $method, $callable );
      }
    }

    /**
     * Return the array list with allowed method. This is a Key value pairs array with value for not signin user ajax
     * method allowed.
     *
     * @brief Ajax actions list
     *
     * @return array
     */
    protected function actions()
    {
      /* To override. */
      return array();
    }

  } // class WPDKAjax
}
/// @endcond