<?php
/**
 * Manage the frontend theme area
 *
 * ## Overview
 *
 * This class is used when the frontend is loaded. You can subclassing this class for get a lot of facilities when you
 * have to manage the theme interactions.
 *
 * ### Benefits
 * This class prepare for us some useful and common action/filter hook.
 *
 * @class              WPDKWordPressTheme
 * @author             =undo= <info@wpxtre.me>
 * @copyright          Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date               2013-10-18
 * @version            0.9.0
 */

class WPDKWordPressTheme extends WPDKObject {

  /**
   * Override version
   *
   * @brief Version
   *
   * @var string $version
   */
  public $version = '0.9.0';

  /**
   * Your main plugin instance
   *
   * @brief Plugin pointer
   *
   * @var WPDKWordPressPlugin $plugin
   */
  public $plugin;

  /**
   * Create a WPDKWordPressTheme object instance
   *
   * @brief Construct
   *
   * @param WPDKWordPressPlugin $plugin Optional. Your main plugin instance
   *
   * @return WPDKWordPressPlugin
   */
  public function __construct( WPDKWordPressPlugin $plugin = null ) {
    $this->plugin = $plugin;

    /* Before init */
    add_action( 'after_setup_theme', array( $this, 'after_setup_theme' ) );

    /* Core actions */
    add_action( 'wp', array( $this, 'wp' ) );
    add_action( 'wp_head', array( $this, 'wp_head' ) );
    add_action( 'wp_footer', array( $this, 'wp_footer' ) );

    /* Add classes to body class. */
    add_filter( 'body_class', array( $this, '_body_class' ) );

    /* Scripts and styles. */
    add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ) );

    /* Template loader */
    add_action( 'template_redirect', array( $this, 'template_redirect' ) );
    add_filter( 'template_include', array( $this, 'template_include' ) );
  }

  // -----------------------------------------------------------------------------------------------------------------
  // WordPress Hook
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * Called when WordPress makes the class attribute of `body` tag
   *
   * @brief Adding class in body tag
   *
   * @param array $classes List of classes
   *
   * @return array New list class
   */
  public function _body_class( $classes )
  {
    /* Auto insert the plugin slug in body class */
    if ( !is_null( $this->plugin ) ) {
      $classes[] = sprintf( ' %s-body', $this->plugin->slug );
    }
    return $classes;
  }

  // -----------------------------------------------------------------------------------------------------------------
  // Override
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * Called by after_setup_theme action
   *
   * @brief WordPress action to setup theme
   */
  public function after_setup_theme()
  {
    /* To override */
  }

  /**
   * Called by `template_redirect` action. This action is called before the frontend theme is displayed.
   *
   * @brief WordPress action before theme is displayed
   */
  public function template_redirect()
  {
    /* To override */
  }

  /**
   * Called by `template_include` filter. This filter is useful to change the defaul theme filename.
   *
   * @brief WordPress filter before a template is loaded
   *
   * @param string $template The URL of template
   *
   * @return string A new URl template
   */
  public function template_include( $template )
  {
    /* To override */
    return $template;
  }

  /**
   * Called by `wp` action
   *
   * @brief WordPress action for start
   */
  public function wp()
  {
    /* To override */
  }

  /**
   * Called by `wp_head` action. This action is called after the `head` section and before the `body` tag.
   *
   * @brief WordPress action in head theme
   *
   */
  public function wp_head()
  {
    /* To override */
  }

  /**
   * Called by wp_footer action. This action is called in the footer theme.
   *
   * @brief WordPress action for theme footer
   *
   */
  public function wp_footer()
  {
    /* To override */
  }

  /**
   * Called by `wp_enqueue_scripts` action. You will use this action to register (do a queue) scripts and styles.
   *
   * @brief WordPress action for scripts and styles
   */
  public function wp_enqueue_scripts()
  {
    /* To override */
  }

}

/// @cond private

/*
 * [DRAFT]
 *
 * THE FOLLOWING CODE IS A DRAFT. FEEL FREE TO USE IT TO MAKE SOME EXPERIMENTS, BUT DO NOT USE IT IN ANY CASE IN
 * PRODUCTION ENVIRONMENT. ALL CLASSES AND RELATIVE METHODS BELOW CAN CHNAGE IN THE FUTURE RELEASES.
 *
 */

/**
 * Experimental
 *
 * ## Overview
 *
 * Base class for front end theme. This class is used to develop a theme.
 *
 * @class           WPDKTheme
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-10-18
 * @version         1.0.1
 *
 */
class WPDKTheme extends WPDKObject {

  /**
   * Override version
   *
   * @brief Version
   *
   * @var string $version
   */
  public $version = '1.0.1';

  /**
   * The Theme URL more `assets/`. This property is very useful for read style sheet and Javascript file in the
   * 'assets' folder.
   *
   * @brief Assets URL
   *
   * @var string $assetsURL
   */
  public $assetsURL;

  /**
   * The Theme URL more `assets/css/`
   *
   * @brief Style sheet URL
   *
   * @var string $cssURL
   */
  public $cssURL;

  /**
   * The Theme URL more `assets/css/images/`
   *
   * @brief Images URL
   *
   * @var string $imagesURL
   */
  public $imagesURL;

  /**
   * The Theme URL more `assets/js/`
   *
   * @brief Javascript URL
   *
   * @var string $javascriptURL
   */
  public $javascriptURL;

  /**
   * Instance of WP_Theme class
   *
   * @brief WP Theme
   *
   * @var WP_Theme $theme
   */
  public $theme;

  /**
   * Filesystem theme path. Alias TEMPLATEPATH
   *
   * @brief Filesystem theme path
   *
   * @var string $path
   */
  public $path;

  /**
   * The Filesystem theme path more `classes/`
   *
   * @brief Classes path
   *
   * @var string $classesPath
   */
  public $classPath;

  /**
   * The array of loading path related to any WPX theme class. This array is related to the specific WPX theme
   * that extends this base class.
   *
   * @brief The array of loading path related to any WPX theme class.
   *
   * @var array $_wpxThemeClassLoadingPath
   *
   * @since 0.10.0
   */
  private $_wpxThemeClassLoadingPath;

  /**
   * Create an instance of WPDKTheme class
   *
   * @brief Construct
   *
   * @param string $file
   *
   * @return WPDKTheme
   */
  public function __construct( $file ) {

    /* Autoload. */
    $this->_wpxThemeClassLoadingPath = array();
    spl_autoload_extensions( '.php' ); // for faster execution
    spl_autoload_register( array( $this, 'autoloadEnvironment' ) );

    /* Path unix. */
    $this->path        = trailingslashit( dirname( $file ) );
    $this->classesPath = $this->path . 'classes/';

    /* URLs. */
    $this->url           = trailingslashit( get_template_directory_uri() );
    $this->assetsURL     = $this->url . 'assets/';
    $this->cssURL        = $this->assetsURL . 'css/';
    $this->imagesURL     = $this->assetsURL . 'images/';
    $this->javascriptURL = $this->assetsURL . 'js/';

    $theme_key         = basename( dirname( $file ) );
    $theme_directories = search_theme_directories();

    $theme_file = $theme_directories[$theme_key]['theme_file'];
    $theme_root = $theme_directories[$theme_key]['theme_root'];

    /* WP_Theme is a final class, so I must create a part object. */
    $this->theme = new WP_Theme( $theme_key, $theme_root );

    /* Setup. */
    add_action( 'init', array( $this, 'init_theme' ) );

    /* Shortcodes. */
    add_action( 'init', array( $this, 'init_shortcode' ) );

    /* Client setup. */
    add_action( 'init', array( $this, 'setup' ) );

    /* Ajax setup. */
    if ( wpdk_is_ajax() ) {
      add_action( 'init', array( $this, 'ajax' ) );
    }

    /* After setup. */
    add_action( 'after_setup_theme', array( $this, 'after_setup_theme' ) );

    /* Add script and styles. */
    add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ) );

  }

  /**
   * Description
   *
   * @brief Set Up
   */
  public function init_theme() {
    /* You can override in your subclass. */
  }

  /**
   * Description
   *
   * @brief Init shortcodes
   */
  public function init_shortcode() {
    /* You can override in your subclass. */
  }

  /**
   * Description
   *
   * @brief Your main init
   */
  public function setup() {
    /* You can override in your subclass. */
  }

  /**
   * Description
   *
   * @brief Your main init
   */
  public function ajax() {
    /* You can override in your subclass. */
  }

  /**
   * Setup theme
   *
   * @brief Setup theme
   * @note To override
   *
   */
  public function after_setup_theme() {
    die( __METHOD__ . ' must be override in your subclass' );
  }

  /**
   * Description
   *
   * @brief Script and styles
   */
  public function wp_enqueue_scripts() {
    /* You can override in your subclass */
  }

  /**
   * This function records a WPX theme class into autoloading register, joined with its loading path.
   * The function has some facility in its first param, in order to allow both string and array loading of class
   * names ( useful in case of a group of classes that are defined in a single file ).
   *
   * 1. $this->registerAutoloadClass( 'file.php', 'ClassName' );
   *
   * 2. $this->registerAutoloadClass( array( 'file.php' => 'ClassName' ) );
   *
   * 3. $this->registerAutoloadClass( array( 'file.php' => array( 'ClassName', 'ClassName', ... ) ) );
   *
   *
   * @brief Records a WPX theme class into autoloading register.
   *
   * @param string|array $sLoadingPath Path of class when $mClassName is a string
   * @param string       $mClassName   Optional. The single class name or key value pairs array with path => classes
   */
  public function registerAutoloadClass( $sLoadingPath, $mClassName = '' ) {

    /* 1. */
    if ( is_string( $sLoadingPath ) && is_string( $mClassName ) && !empty( $mClassName ) ) {
      $sClassNameLowerCased                                   = strtolower( $mClassName );
      $this->_wpxThemeClassLoadingPath[$sClassNameLowerCased] = $sLoadingPath;
    }

    /* 2. */
    elseif ( is_array( $sLoadingPath ) ) {
      foreach ( $sLoadingPath as $path => $classes ) {
        if ( is_string( $classes ) ) {
          $class_name                                   = strtolower( $classes );
          $this->_wpxThemeClassLoadingPath[$class_name] = $path;
        }

        /* 3. */
        elseif ( is_array( $classes ) ) {
          foreach ( $classes as $class_name ) {
            $class_name                                   = strtolower( $class_name );
            $this->_wpxThemeClassLoadingPath[$class_name] = $path;
          }
        }
      }
    }
  }

  /**
   * This function performs runtime autoloading of a class specifically related to this instance; this autoloading
   * is based on previous class registering that has to be executed before.
   *
   * NOTE: this SPL autoloading logic is encapsulated in every single plugin instance that extends this class,
   * because it is embedded into an instance of WPDKWordPressPlugin. So any plugin has its own SPL autoloading logic.
   *
   * @brief Runtime autoloading of theme classes.
   *
   * @param string $sClassName - The class that has to be loaded right now
   *
   */
  public function autoloadEnvironment( $sClassName ) {

    // For backward compatibility and for better matching
    $sClassNameLowerCased = strtolower( $sClassName );
    if ( isset( $this->_wpxThemeClassLoadingPath[$sClassNameLowerCased] ) ) {
      require_once( $this->_wpxThemeClassLoadingPath[$sClassNameLowerCased] );
    }

  }

}

/// @endcond