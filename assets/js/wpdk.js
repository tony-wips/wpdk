/**
 * Like PHP empty()
 *
 * @brief Check emmpty
 * @since 1.0.0.b3
 *
 * @param mixed_var
 * @return {Boolean}
 */
function empty( mixed_var ) {
  // Checks if the argument variable is empty
  // undefined, null, false, number 0, empty string,
  // string "0", objects without properties and empty arrays
  // are considered empty
  //
  // http://kevin.vanzonneveld.net
  // +   original by: Philippe Baumann
  // +      input by: Onno Marsman
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: LH
  // +   improved by: Onno Marsman
  // +   improved by: Francesco
  // +   improved by: Marc Jansen
  // +      input by: Stoyan Kyosev (http://www.svest.org/)
  // +   improved by: Rafal Kukawski
  // *     example 1: empty(null);
  // *     returns 1: true
  // *     example 2: empty(undefined);
  // *     returns 2: true
  // *     example 3: empty([]);
  // *     returns 3: true
  // *     example 4: empty({});
  // *     returns 4: true
  // *     example 5: empty({'aFunc' : function () { alert('humpty'); } });
  // *     returns 5: false
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, "", "0"];

  for ( i = 0, len = emptyValues.length; i < len; i++ ) {
    if ( mixed_var === emptyValues[i] ) {
      return true;
    }
  }

  if ( typeof mixed_var === "object" ) {
    for ( key in mixed_var ) {
      // TODO: should we check for own properties only?
      //if (mixed_var.hasOwnProperty(key)) {
      return false;
      //}
    }
    return true;
  }

  return false;
}

/**
 * Like PHP isset()
 *
 * @brief Check isset
 * @since 1.0.0.b3
 *
 * @return {Boolean}
 */
function isset() {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: FremyCompany
  // +   improved by: Onno Marsman
  // +   improved by: Rafał Kukawski
  // *     example 1: isset( undefined, true);
  // *     returns 1: false
  // *     example 2: isset( 'Kevin van Zonneveld' );
  // *     returns 2: true
  var a = arguments,
    l = a.length,
    i = 0,
    undef;

  if ( l === 0 ) {
    throw new Error( 'Empty isset' );
  }

  while ( i !== l ) {
    if ( a[i] === undef || a[i] === null ) {
      return false;
    }
    i++;
  }
  return true;
}

/**
 * Do a sprintf()
 *
 * @brief Replace sprintf()
 *
 * @since 1.0.0.b3
 *
 * @return {*|void}
 */
function sprintf() {
  // http://kevin.vanzonneveld.net
  // +   original by: Ash Searle (http://hexmen.com/blog/)
  // + namespaced by: Michael White (http://getsprink.com)
  // +    tweaked by: Jack
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Paulo Freitas
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Dj
  // +   improved by: Allidylls
  // *     example 1: sprintf("%01.2f", 123.1);
  // *     returns 1: 123.10
  // *     example 2: sprintf("[%10s]", 'monkey');
  // *     returns 2: '[    monkey]'
  // *     example 3: sprintf("[%'#10s]", 'monkey');
  // *     returns 3: '[####monkey]'
  // *     example 4: sprintf("%d", 123456789012345);
  // *     returns 4: '123456789012345'
  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments,
    i = 0,
    format = a[i++];

  // pad()
  var pad = function ( str, len, chr, leftJustify ) {
    if ( !chr ) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : Array( 1 + len - str.length >>> 0 ).join( chr );
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function ( value, prefix, leftJustify, minWidth, zeroPad, customPadChar ) {
    var diff = minWidth - value.length;
    if ( diff > 0 ) {
      if ( leftJustify || !zeroPad ) {
        value = pad( value, minWidth, customPadChar, leftJustify );
      }
      else {
        value = value.slice( 0, prefix.length ) + pad( '', diff, '0', true ) + value.slice( prefix.length );
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function ( value, base, prefix, leftJustify, minWidth, precision, zeroPad ) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2'  : '0b',
      '8'  : '0',
      '16' : '0x'
    }[base] || '';
    value = prefix + pad( number.toString( base ), precision || 0, '0', false );
    return justify( value, prefix, leftJustify, minWidth, zeroPad );
  };

  // formatString()
  var formatString = function ( value, leftJustify, minWidth, precision, zeroPad, customPadChar ) {
    if ( precision != null ) {
      value = value.slice( 0, precision );
    }
    return justify( value, '', leftJustify, minWidth, zeroPad, customPadChar );
  };

  // doFormat()
  var doFormat = function ( substring, valueIndex, flags, minWidth, _, precision, type ) {
    var number;
    var prefix;
    var method;
    var textTransform;
    var value;

    if ( substring == '%%' ) {
      return '%';
    }

    // parse flags
    var leftJustify = false,
      positivePrefix = '',
      zeroPad = false,
      prefixBaseX = false,
      customPadChar = ' ';
    var flagsl = flags.length;
    for ( var j = 0; flags && j < flagsl; j++ ) {
      switch ( flags.charAt( j ) ) {
        case ' ':
          positivePrefix = ' ';
          break;
        case '+':
          positivePrefix = '+';
          break;
        case '-':
          leftJustify = true;
          break;
        case "'":
          customPadChar = flags.charAt( j + 1 );
          break;
        case '0':
          zeroPad = true;
          break;
        case '#':
          prefixBaseX = true;
          break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if ( !minWidth ) {
      minWidth = 0;
    }
    else if ( minWidth == '*' ) {
      minWidth = +a[i++];
    }
    else if ( minWidth.charAt( 0 ) == '*' ) {
      minWidth = +a[minWidth.slice( 1, -1 )];
    }
    else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if ( minWidth < 0 ) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if ( !isFinite( minWidth ) ) {
      throw new Error( 'sprintf: (minimum-)width must be finite' );
    }

    if ( !precision ) {
      precision = 'fFeE'.indexOf( type ) > -1 ? 6 : (type == 'd') ? 0 : undefined;
    }
    else if ( precision == '*' ) {
      precision = +a[i++];
    }
    else if ( precision.charAt( 0 ) == '*' ) {
      precision = +a[precision.slice( 1, -1 )];
    }
    else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice( 0, -1 )] : a[i++];

    switch ( type ) {
      case 's':
        return formatString( String( value ), leftJustify, minWidth, precision, zeroPad, customPadChar );
      case 'c':
        return formatString( String.fromCharCode( +value ), leftJustify, minWidth, precision, zeroPad );
      case 'b':
        return formatBaseX( value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad );
      case 'o':
        return formatBaseX( value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad );
      case 'x':
        return formatBaseX( value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad );
      case 'X':
        return formatBaseX( value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad ).toUpperCase();
      case 'u':
        return formatBaseX( value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad );
      case 'i':
      case 'd':
        number = +value || 0;
        number = Math.round( number - number % 1 ); // Plain Math.round doesn't just truncate
        prefix = number < 0 ? '-' : positivePrefix;
        value = prefix + pad( String( Math.abs( number ) ), precision, '0', false );
        return justify( value, prefix, leftJustify, minWidth, zeroPad );
      case 'e':
      case 'E':
      case 'f': // Should handle locales (as per setlocale)
      case 'F':
      case 'g':
      case 'G':
        number = +value;
        prefix = number < 0 ? '-' : positivePrefix;
        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf( type.toLowerCase() )];
        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf( type ) % 2];
        value = prefix + Math.abs( number )[method]( precision );
        return justify( value, prefix, leftJustify, minWidth, zeroPad )[textTransform]();
      default:
        return substring;
    }
  };

  return format.replace( regex, doFormat );
}

/**
 * Porting of PHP join function
 *
 * @param glue
 * @param pieces
 * @return {*}
 */
function join( glue, pieces ) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // -    depends on: implode
  // *     example 1: join(' ', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: 'Kevin van Zonneveld'
  return this.implode( glue, pieces );
}

/**
 *
 * @param glue
 * @param pieces
 * @return {*}
 */
function implode( glue, pieces ) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Waldo Malqui Silva
  // +   improved by: Itsacon (http://www.itsacon.net/)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: 'Kevin van Zonneveld'
  // *     example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
  // *     returns 2: 'Kevin van Zonneveld'
  var i = '',
    retVal = '',
    tGlue = '';
  if ( arguments.length === 1 ) {
    pieces = glue;
    glue = '';
  }
  if ( typeof(pieces) === 'object' ) {
    if ( Object.prototype.toString.call( pieces ) === '[object Array]' ) {
      return pieces.join( glue );
    }
    for ( i in pieces ) {
      retVal += tGlue + pieces[i];
      tGlue = glue;
    }
    return retVal;
  }
  return pieces;
}

/**
 * Return TRUE if the string NOT contains '', 'false', '0', 'no', 'n', 'off', null.
 *
 * @brief Check if bool
 * @since 1.0.0.b4
 *
 * @note This is a porting of homonymous php function to check if a param is TRUE.
 *
 * @param $mixed
 *
 * @return {Boolean}
 */
function wpdk_is_bool( $mixed ) {
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, "", "0", 'n', 'no', 'off', 'false'];
  for ( i = 0, len = emptyValues.length; i < len; i++ ) {
    if ( $mixed === emptyValues[i] || $mixed.toLowerCase() == emptyValues[i] ) {
      return false;
    }
  }
  return true;
}

/**
 * Initialize a jQuery plugin scroller
 *
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2012-11-28
 * @version         0.8.1
 *
 */
(function ( $ ) {
  $.fn.extend( {

    scroller : function () {

      // Iterate over the current set of matched elements
      return this.each( function () {

        var $this = $( this );
        var $scroller = $this.find( 'div' ).eq( 0 );

        var scroller_height = parseInt( $scroller.height() );
        var timing = (200 + scroller_height) * 50;

        $this.css( { height : '200px', overflow : 'hidden', marginBottom : '32px' } );

        $scroller.css( { marginTop : '200px' } );

        var moveup = function () {
          var posy = parseInt( $scroller.css( 'marginTop' ) );
          posy -= 2;
          $scroller.css( { marginTop : posy + 'px' } );
          if ( posy < -scroller_height ) {
            $scroller.css( { marginTop : '200px' } );
          }
        };

        $scroller.animate( { marginTop : -scroller_height }, timing );

      } );
    }
  } );
})( jQuery );

/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function ( factory )
{
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as anonymous module.
    define( ['jquery'], factory );
  }
  else {
    // Browser globals.
    factory( jQuery );
  }
}( function ( $ )
{

  var pluses = /\+/g;

  function raw( s )
  {
    return s;
  }

  function decoded( s )
  {
    return decodeURIComponent( s.replace( pluses, ' ' ) );
  }

  function converted( s )
  {
    if ( s.indexOf( '"' ) === 0 ) {
      // This is a quoted cookie as according to RFC2068, unescape
      s = s.slice( 1, -1 ).replace( /\\"/g, '"' ).replace( /\\\\/g, '\\' );
    }
    try {
      return config.json ? JSON.parse( s ) : s;
    } catch (er) {
    }
  }

  var config = $.cookie = function ( key, value, options )
  {

    // write
    if ( value !== undefined ) {
      options = $.extend( {}, config.defaults, options );

      if ( typeof options.expires === 'number' ) {
        var days = options.expires, t = options.expires = new Date();
        t.setDate( t.getDate() + days );
      }

      value = config.json ? JSON.stringify( value ) : String( value );

      return (document.cookie = [
        config.raw ? key : encodeURIComponent( key ),
        '=',
        config.raw ? value : encodeURIComponent( value ),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join( '' ));
    }

    // read
    var decode = config.raw ? raw : decoded;
    var cookies = document.cookie.split( '; ' );
    var result = key ? undefined : {};
    for ( var i = 0, l = cookies.length; i < l; i++ ) {
      var parts = cookies[i].split( '=' );
      var name = decode( parts.shift() );
      var cookie = decode( parts.join( '=' ) );

      if ( key && key === name ) {
        result = converted( cookie );
        break;
      }

      if ( !key ) {
        result[name] = converted( cookie );
      }
    }

    return result;
  };

  config.defaults = {};

  $.removeCookie = function ( key, options )
  {
    if ( $.cookie( key ) !== undefined ) {
      // Must not alter options, thus extending a fresh object...
      $.cookie( key, '', $.extend( {}, options, { expires : -1 } ) );
      return true;
    }
    return false;
  };

} ));


/**
 * WPDK Swipe Control extend
 *
 * @param v
 * @returns {*}
 */
jQuery.fn.swipe = function ( v ) {
  if ( jQuery( this ).hasClass( 'wpdk-form-swipe' ) ) {
    /* Get main control. */
    var $control = jQuery( this );

    /* Get sub-elements. */
    var $knob = $control.children( 'span' ).eq( 0 );
    var $input = $control.children( 'input[type=hidden]' ).eq( 0 );

    /* Set. */
    if ( typeof( v ) != 'undefined' ) {

      /* On. */
      if ( 'on' === v ) {
        $input.val( 'on' );
        $control.triggerHandler( 'change', [ $control, 'on' ] );
        $knob.animate( { marginLeft : '23px' }, 100, function () {
          $control.addClass( 'wpdk-form-swipe-on' );
        } );
      }

      /* Off. */
      else {
        $input.val( 'off' );
        $control.triggerHandler( 'change', [ $control, 'off' ] );
        $knob.animate( { marginLeft : '0' }, 100, function () {
          $control.removeClass( 'wpdk-form-swipe-on' );
        } );
      }
    }

    /* Get. */
    else {
      return $input.val();
    }
  }
};

/**
 * This class manage all forms controles and fields, attach new event and perform special actions.
 *
 * @class           WPDKControls
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-06-18
 * @version         1.0.0
 *
 */
var WPDKControls = (function ( $ ) {

  /**
   * Internal class pointer
   *
   * @brief This object
   */
  var $this = {};

  // -----------------------------------------------------------------------------------------------------------------
  // Public properties
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * The WPDKControls version
   *
   * @brief Version
   */
  $this.version = "1.0.0";

  /**
   * Init this class
   *
   * @brief Init this class
   */
  $this.init = function () {
    _initClearInput();
    _initSwipeControl();
    _initLockedControl();
    _initAccordion();
    _initBehavior();
    _initGuide();
  };

  /**
   * Return the standard form for a configuration view. See wpdk-ui.php for more detail.
   *
   * @brief Get the form
   * @since 0.9.5
   * @deprecated since 1.2.0 use preferencesForm() instead
   *
   * @param {string} $id Configuration view ID
   * @return {*|jQuery|HTMLElement}
   */
  $this.configurationForm = function ( $id )
  {
    return $( 'form#wpdk_configuration_view_form-' + $id );
  };

  /**
   * Return the standard form for a preferences view. See wpdk-ui.php for more detail.
   *
   * @brief Get the form ID
   * @since 1.2.0
   *
   * @param {string} $id Preferences form ID
   *
   * @return {*|jQuery|HTMLElement}
   */
  $this.preferencesForm = function ( $id )
  {
    return $( 'form#wpdk_preferences_view_form-' + $id );
  };

  /**
   * Init the guide engine to open a modal twitter window with an iframe to developer center
   *
   * @brief Init the guide engine
   * @since 1.0.0.b4
   *
   * @private
   */
  function _initGuide() {
    $( 'a.wpdk-guide' ).click( function () {

      // Set guide title
      var $title = $( this ).data( 'title' );

      // If guide content is directly into data-content attribute
      if( typeof $( this ).data( 'content' ) != 'undefined' && $( this ).data( 'content' ).length > 0 ) {
        var $content = $( this ).data( 'content' );
      }
      // If guide is in Developer Center
      else {
        var $url = sprintf( 'https://developer.wpxtre.me/api/v1/articles/%s', $( this ).attr( 'href' ) );
        var $content = sprintf( '<iframe class="wpdk-iframe-guide" frameborder="0" height="520" width="530" src="%s"></iframe>', $url );
      }

      var $modal = new WPDKTwitterBootstrapModal( 'wpdk-guide', $title, $content );
      $modal.height = 512;
      $modal.display();

      return false;
    } );
  }

  /**
   * When an input field has the clear right button, on click the previous left input is cleaned.
   *
   * @brief Clear input field
   *
   * @private
   */
  function _initClearInput() {
    $( document ).on( 'click', 'span.wpdk-form-clear-left', false, function () {
      $( this ).prev().val( '' ).triggerHandler( 'change' );
    } );
  }

  /**
   * Initialize the WPDK custom Swipe Control.
   * When a Swipe Control is clicked (or swipe) an event `swipe` is trigged:
   *
   *     $('.wpdk-form-swipe').on('swipe', function(a, swipeButton, status ) {});
   *
   * @brief Init Swipe
   *
   * @private
   */
  function _initSwipeControl() {
    $( document ).on( 'click', 'span.wpdk-form-swipe span', false, function () {
      var $control = $( this ).parent();
      var $status = wpdk_is_bool( $control.swipe() );
      var $enabled = $status ? 'off' : 'on';
      var $result = $control.triggerHandler( 'swipe', [ $control, $enabled] );
      if( typeof $result == 'undefined' || $result ) {
        $control.swipe( $enabled );
      }
    } );
  }

  /**
   * A Locked Control is a special input text when a lock to avoid change unwanted.
   * When you try to edit this field a Javascript confirm is displayed. You have to confirm the edit to next.
   *
   * @brief Init Locked Control
   *
   * @private
   */
  function _initLockedControl() {
    $( document ).on( 'click', '.wpdk-form-locked', false, function () {
      if ( confirm( wpdk_i18n.messageUnLockField ) ) {
        $( this )
          .attr( 'class', 'wpdk-form-unlocked' )
          .prev( 'input' )
          .removeAttr( 'readonly' );
      }
    } );
  }

  /**
   * Initialize the wpdk accordion
   *
   * @brief Init accordion
   *
   * @private
   */
  function _initAccordion() {
    if ( $( 'i.wpdk-openclose-accordion' ).length ) {
      /* Memorizzo altezza */
      $( 'i.wpdk-openclose-accordion' ).parent().next( 'div.wpdk-accordion' ).each( function ( i, e ) {
        $( this ).addClass( 'wpdk-accordion-open' ).data( 'height', $( this ).height() );
        if ( i > 0 ) {
          $( this ).removeClass( 'wpdk-accordion-open' );
        }
        else {
          $( e ).css( 'height', $( e ).data( 'height' ) + 'px' );
        }
      } );

      $( 'i.wpdk-openclose-accordion' ).click( function () {
        /* Chiudo tutti gli altri - solo i fieldsset del form parent */
        var $form = $( this ).parents( 'form' );
        $form.find( 'fieldset' ).removeClass( 'wpdk-accordion-open' );
        $form.find( 'fieldset div.wpdk-accordion' ).css( 'height', '0' );

        /* Me stesso lo apro */
        $( this ).parents( 'fieldset' ).addClass( 'wpdk-accordion-open' );

        /* Animation su container */
        var $container = $( this ).parent().next( 'div.wpdk-accordion' );
        $container.css( 'height', $container.data( 'height' ) + 'px' );

      } );
    }
  }

  /**
   * Initialize special behaviors as auto disabled after click, and more.
   *
   * @brief Initialize special behaviors
   *
   * @private
   */
  function _initBehavior() {

    /* Disabled after click for input. */
    $( 'input.wpdk-disable-after-click' ).click( function () {
      $( this ).addClass( 'disabled' );
    } );
  }

  return $this;

})( jQuery );

/**
 * This class manage all forms and fields, attach new event and perform special actions.
 *
 * @class           WPDKTwitterBootstrap
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-10-08
 * @version         1.0.0
 *
 */
var WPDKTwitterBootstrap = (function ( $ ) {

  /**
   * Internal class pointer
   *
   * @brief This object
   */
  var $this = {};

  // -----------------------------------------------------------------------------------------------------------------
  // Public properties
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * The WPDKTwitterBootstrap version
   *
   * @brief Version
   */
  $this.version = "1.0.0";

  /**
   * Init this class
   *
   * @brief Init this class
   */
  $this.init = function ()
  {
    $( document ).ready( _init );
  };

  /**
   * Init when the document is ready
   *
   * @brief Document ready
   *
   * @private
   */
  function _init() {
    /* Init tooltip. */
    $( '.wpdk-tooltip' ).wpdkTooltip();

    /* Init alert. */
    $().alert();
  }

  return $this;

})( jQuery );

/**
 * This class manage all jQuery enhancer
 *
 * @class           WPDKjQuery
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-08-23
 * @version         1.1.1
 */
var WPDKjQuery = (function ( $ ) {

  /**
   * Internal class pointer
   *
   * @brief This object
   */
  var $this = {};

  /**
   * The WPDKTwitterBootstrap version
   *
   * @brief Version
   */
  $this.version = "1.1.0";

  /**
   * Return the jQury version.
   *
   * @return string
   */
  $this.jQueryVersion = function ()
  {
    return $().jquery;
  }

  /**
   * Return the jQury UI version. Return false if jQuery UI is not loaded
   *
   * @return bool|string
   */
  $this.jQueryUIVersion = function ()
  {
    if ( $.ui && $.ui.version ) {
      return $.ui.version;
    }
    return false;
  }



  /**
   * Init this class
   *
   * @brief Init this class
   */
  $this.init = function () {
    $( document ).ready( _init );
  };

  /**
   * Init ehrn the document is ready
   * @private
   */
  function _init()
  {
    _initDatePicker();
    _initTabs();
    __initAutocomplete();
    _initAutocomplete();
    _initCopyPaste();

    /* Wrap the date picker with my pwn class. */
    $( '#ui-datepicker-div' ).wrap( '<div class="wpdk-jquery-ui"/>' );
  }

  /**
   * Initialize the Date Picker
   *
   * @brief Init Date Picker
   *
   * @private
   */
  function _initDatePicker()
  {

    /* Enable Date Picker on wpdk input class. */
    $( 'input.wpdk-form-date' ).datepicker();

    /* Locale */
    if ( $().datetimepicker ) {
      $( 'input.wpdk-form-datetime:visible' ).datetimepicker( {
        timeOnlyTitle : wpdk_i18n.timeOnlyTitle,
        timeText      : wpdk_i18n.timeText,
        hourText      : wpdk_i18n.hourText,
        minuteText    : wpdk_i18n.minuteText,
        secondText    : wpdk_i18n.secondText,
        currentText   : wpdk_i18n.currentText,
        dayNamesMin   : (wpdk_i18n.dayNamesMin).split( ',' ),
        monthNames    : (wpdk_i18n.monthNames).split( ',' ),
        closeText     : wpdk_i18n.closeText,
        timeFormat    : wpdk_i18n.timeFormat,
        dateFormat    : wpdk_i18n.dateFormat
      } );
    }
    else {
      if ( typeof window.console !== 'undefined' ) {
        alert( 'Date Time Picker not loaded' );
      }
    }

    /* Date Picker defaults */
    $.datepicker.setDefaults( {
      changeMonth     : true,
      changeYear      : true,
      dayNamesMin     : (wpdk_i18n.dayNamesMin).split( ',' ),
      monthNames      : (wpdk_i18n.monthNames).split( ',' ),
      monthNamesShort : (wpdk_i18n.monthNamesShort).split( ',' ),
      dateFormat      : wpdk_i18n.dateFormat
    } );
  }

  /**
   * Initialize the jQuery Tabs with special cookie for remember the open tab.
   *
   * @brief Init jQuery Tabs
   *
   * @private
   */
  function _initTabs()
  {
    $( ".wpdk-tabs" ).tabs();

    if ( document.location.href.indexOf( '#' ) > 0 ) {
    }
    else {
      $( ".wpdk-tabs" ).each( function ()
      {
        var id = $( this ).attr( "id" );
        if ( 'undefined' !== typeof(id) ) {
          $( this ).tabs( {
            activate : function ( e, ui )
            {
              $.cookie( id, ui.newTab.index(), { path : '/' } );
            },
            active   : $.cookie( id )
          } );
        }
      } );
    }
  }

  /**
   * Attach an autocomplete Ajax event when an input has the `data-autocomplete_action` attribute.
   * Usually you will use an input text. When you digit smething an Ajax call is made with action get from
   * `autocomplete_action` attribute.
   *
   * @brief Autocomplete
   * @deprecated Since 1.0.0.b4
   *
   * @private
   */
  function __initAutocomplete()
  {
    $( 'input[data-autocomplete_action]' ).each( function ( index, element )
    {
      $( element ).autocomplete(
        {
          source    : function ( request, response )
          {
            $.post( wpdk_i18n.ajaxURL,
              {
                action          : $( element ).data( 'autocomplete_action' ),
                autocomplete_id : $( element ).data( 'autocomplete_id' ),
                data            : $( element ).data( 'user_data' ),
                term            : request.term
              },
              function ( data )
              {
                response( $.parseJSON( data ) );
              } );
          },
          select    : function ( event, ui )
          {
            if ( typeof ui.item.href !== 'undefined' ) {
              document.location = ui.item.href;
            }
            else {
              var $name = $( element ).data( 'autocomplete_target' );
              $( 'input[name=' + $name + ']' ).val( ui.item.id );
            }
          },
          minLength : $( element ).data( 'autocomplete_min_length' ) | 0
        }
      );
    } );
  }

  /**
   * Select all input with data-autocomplete attribute and init the right autocomplete subset
   *
   * @brief Init the right autocomplete
   *
   * @private
   */
  function _initAutocomplete()
  {
    $( 'input[data-autocomplete]' ).each( function ( index, element )
    {
      switch ( $( element ).data( 'autocomplete' ) ) {
        case 'posts':
          _initAutocompletePosts( element );
          break;

        case 'embed':
        case 'inline':
          _initAutocompleteEmbed( element );
          break;

        case 'custom':
          _initAutocompleteCustom( element );
          break;
      }
    } );
  }

  /**
   * Attach an autocomplete Ajax event when an input has the `data-autocomplete_posts` attribute.
   * Usually you will use an input text. When you digit something an Ajax call 'wpdk_action_autocomplete_posts' is made.
   *
   * @brief Autocomplete Posts
   *
   * @param element DOM element
   *
   * @private
   */
  function _initAutocompletePosts( element )
  {

    /* Init. */
    $( element ).autocomplete(
      {
        source    : function ( request, response )
        {
          $.post( wpdk_i18n.ajaxURL,
            {
              action      : 'wpdk_action_autocomplete_posts',
              post_type   : function ()
              {
                var $post_type = '';
                if ( $( $( element ).data( 'post_type' ) ).length ) {
                  $post_type = $( $( element ).data( 'post_type' ) ).val();
                }
                /* The data attribute post type contains the post type id. */
                else {
                  $post_type = $( element ).data( 'post_type' );
                }
                return $post_type;
              },
              post_status : $( element ).data( 'post_status' ),
              limit       : $( element ).data( 'limit' ),
              order       : $( element ).data( 'order' ),
              orderby     : $( element ).data( 'orderby' ),
              term        : request.term
            },
            function ( data )
            {
              response( $.parseJSON( data ) );
            } );
        },
        select    : function ( event, ui )
        {
          if ( typeof ui.item.href !== 'undefined' ) {
            document.location = ui.item.href;
          }
          else {
            var $name = $( element ).data( 'target' );
            if ( !empty( $name ) ) {
              $( 'input[name=' + $name + ']' ).val( ui.item.id );
            }
          }
        },
        minLength : $( element ).data( 'min_length' ) | 0
      }
    );
  }

  /**
   * Init an autocomplete with a jSON array embed (inner) into the element
   *
   * @brief Init embed autocomplete
   *
   * @param element DOM element
   * @private
   */
  function _initAutocompleteEmbed( element )
  {
    var $source = $( element ).data( 'source' );

    if ( !empty( $source ) ) {

      var $source = $.parseJSON( $( element ).data( 'source' ).replace( /'/g, "\"" ) );
      $( element ).autocomplete(
        {
          source    : $source,
          minLength : $( element ).data( 'min_length' ) | 0
        }
      );
    }
  }

  /**
   * Init an autocomplete with a jSON array embed (inner) into the element
   *
   * @brief Init custom autocomplete
   *
   * @param element DOM element
   * @private
   */
  function _initAutocompleteCustom( element )
  {
    var $source = $.parseJSON( $( element ).data( 'source' ).replace( /'/g, "\"" ) );
    var $function = $( element ).data( 'function' );
    var $select = $( element ).data( 'select' );

    $( element ).autocomplete(
      {
        source    : $source,
        minLength : $( element ).data( 'min_length' ) | 0
      }
    ).data( "ui-autocomplete" )._renderItem = eval( $function );
  }

  /**
   * The Copy and Paste engine allow to copy a value from a source input to a target input.
   *
   * @brief Init the Copy and Paste
   *
   * @private
   */
  function _initCopyPaste()
  {

    /* This is a hack to send in POST/GET the new value in the multiple select tag. */
    $( 'form' ).submit( function ()
    {
      $( '[data-paste]' ).each( function ()
      {
        var paste = $( '#' + $( this ).attr( 'data-paste' ) );
        var element_paste_type = paste.get( 0 ).tagName;
        if ( element_paste_type.toLowerCase() == 'select' && paste.attr( 'multiple' ) !== 'undefined' ) {
          paste.find( 'option' ).attr( 'selected', 'selected' );
        }
      } );
    } );

    /* Copy & Paste */
    $( document ).on( 'click', '.wpdk-form-button-copy-paste', false, function ()
    {
      /* Recupero options */
      var options = $( this ).attr( 'data-options' ) ? $( this ).attr( 'data-options' ).split( ' ' ) : [];

      /* @todo Aggiungere evento/filtro */

      var copy = $( '#' + $( this ).attr( 'data-copy' ) );
      var paste = $( '#' + $( this ).attr( 'data-paste' ) );

      /* Determino da dove copio e dove incollo */
      var element_copy_type = copy.get( 0 ).tagName;

      switch ( element_copy_type.toLowerCase() ) {
        case 'input':
          var value = copy.val();
          var text = value;
          if ( $.inArray( 'clear_after_copy', options ) !== false ) {
            copy.val( '' );
          }
          break;
        case 'select':
          var value = $( 'option:selected', copy ).val();
          var text = $( 'option:selected', copy ).text();
          break;
      }

      if ( value != '' || value != '' ) {

        /* Determino dove devo incollare */
        var element_paste_type = paste.get( 0 ).tagName;

        switch ( element_paste_type.toLowerCase() ) {
          case 'select':
            paste.append( '<option class="wpdk-form-option" value="' + value + '">' + text + '</option>' );
            break;
        }
      }
    } );

    /* Remove. */
    $( document ).on( 'click', '.wpdk-form-button-remove', false, function ()
    {
      var remove_from = $( this ).attr( 'data-remove_from' );
      $( 'option:selected', '#' + remove_from ).remove();
    } );
  }

  return $this;

})( jQuery );

/**
 * This class manage a WPDKDynamicTable
 *
 * @class           WPDKDynamicTable
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-06-18
 * @version         1.0.0
 */
var WPDKDynamicTable = (function ( $ ) {

  /**
   * Internal class pointer
   *
   * @brief This object
   */
  var $this = {};

  /**
   * The WPDKDynamicTable version
   *
   * @brief Version
   */
  $this.version = "1.0.0";

  /**
   * Return a singleton instance of WPDKDynamicTable class
   *
   * @brief Init this class
   *
   * @return WPDKDynamicTable
   */
  $this.init = function () {
    $( document ).ready( _init );
    return $this;
  };

  /**
   * Create an instance of WPDKDynamicTable class
   *
   * @return {WPDKDynamicTable}
   * @private
   */
  function _init() {
    if ( $( 'table.wpdk-dynamic-table' ).length ) {
      $( 'table.wpdk-dynamic-table' ).on( 'click', 'input.wpdk-dt-add-row', false, _addRow );
      $( 'table.wpdk-dynamic-table' ).on( 'click', 'input.wpdk-dt-delete-row', false, _deleteRow );
      /* Sortable. */
      $( 'table.wpdk-dynamic-table-sortable tbody' ).sortable( {
        axis   : "y",
        cursor : "n-resize",
        start  : function ( e, ui ) {},
        stop   : function () {}
      } );
    }

  }

  /**
   * Add a row to the dynamic table
   *
   * @brief Add row
   *
   * @private
   */
  function _addRow() {
    var table = $( this ).parents( 'table.wpdk-dynamic-table' );
    var clone = $( this ).parents( 'tr' ).prevAll( '.wpdk-dt-clone' ).clone();
    clone.removeClass( 'wpdk-dt-clone' ).appendTo( table );
    $( this ).hide().siblings( '.wpdk-dt-clone' ).removeClass( 'wpdk-dt-clone' ).show( function () {
      WPDK.init();
    } );
  }

  /**
   * Delete a row from dynamic table
   *
   * @brief Delete item
   *
   * @private
   */
  function _deleteRow() {
    $( this ).wpdkTooltip( 'hide' );
    $( this ).parents( 'tr' ).fadeOut( 300, function () { $( this ).remove(); } );
  }

  return $this.init();

})( jQuery );

/**
 * This class manage the Preferences view
 *
 * @class           WPDKPreferences
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-08-21
 * @version         1.0.0
 *s
 */

var WPDKPreferences = (function ( $ )
{

  /**
   * Internal class pointer
   *
   * @brief This object
   *
   * @var WPDKPreferences $this
   */
  var $this = {};

  /**
   * The WPDKPreferences version
   *
   * @brief Version
   */
  $this.version = "1.0.0";

  /**
   * Return an instance of WPDKPreferences class
   *
   * @brief Init this class
   *
   * @return WPDKPreferences
   */
  $this.init = function ()
  {
    $( document ).ready( _init );

    return $this;
  }

  /**
   * Init when the document is ready
   *
   * @brief Document ready
   *
   * @private
   */
  function _init()
  {
    /* Display a confirm dialog box before reset a specified branch to default values. */
    $( 'input[name=wpdk_preferences_reset_all]' ).click( function ()
    {
      return confirm( $( this ).data( 'confirm' ) );
    } );

    /* Display a confirm dialog box before reset a specified branch to default values. */
    $( 'input[name=reset-to-default-preferences]' ).click( function ()
    {
      return confirm( $( this ).data( 'confirm' ) );
    } );
  }

  /**
   * This method is used to update the event when the DOM is changed
   *
   * @brief Update event in DOM
   */
  $this.update = function () {}

  return $this.init();

})( jQuery );



/**
 * This is a little Javascript framework to improve the UI and checking control specially in the form management.
 *
 * @class           WPDK
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-04-03
 * @version         0.9.4
 *
 */
var WPDK = (function ( $ ) {

  /**
   * Internal class pointer
   *
   * @brief This object
   */
  var $this = {};

  /**
   * The WPDK Javascript version
   * @brief Version
   */
  $this.version = "0.9.4";

  /**
   * Initialize all Javascript hook.
   * If you modify the DOM you can call this method to refresh hooks.
   *
   * @brief Init
   */
  $this.init = function () {
    _hackMenu();
    WPDKControls.init();
    WPDKjQuery.init();
    WPDKTwitterBootstrap.init();
  };

  /**
   * See WPDK.init();
   *
   * @deprecated Use WPDK.init() instead
   */
  $this.refresh = function () {
    $this.init();
  };

  /**
   * Enabled/Disabled loading on the screen top most
   *
   * @param status True to display loading on top most, False to remove
   *
   * @brief Display or remove the Ajax loader
   */
  $this.loading = function ( status ) {
    if ( status ) {
      $( '<div />' ).addClass( 'wpxm-loader' ).appendTo( 'body' ).fadeIn( 500 );
    }
    else {
      $( 'div.wpxm-loader' ).fadeOut( function () { $( this ).remove() } );
    }
  };

  /**
   * Reload current document with clear and waiting effects
   *
   * @brief Reload document
   * @since 1.0.0.b3
   */
  $this.reloadDocument = function () {
    $( '<div id="wpxm-mask" />' ).appendTo( 'body' );
    document.location = document.location.href;
  };

  // -----------------------------------------------------------------------------------------------------------------
  // wpXtreme Server
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * Send a message to the wpXtreme Server to do a signout from backend admin area.
   *
   * @brief Do signout
   *
   * @todo Move this method to the wpXtreme Server Javascript
   *
   */
  $( 'input[name=wpxserver_logout]' ).click( function () {
    $.post( wpdk_i18n.ajaxURL, {
        action   : 'wpxtreme_action_set_token',
        token    : '',
        referrer : document.location.href
      }, function ( data ) {
        /* I dati arrivano sempre in jSON, come sempre se message è undefined è tutto ok. */
        var result = $.parseJSON( data );
        if ( typeof result.message !== 'undefined' ) {
          alert( result.message );
        }
        else {
          /* Ricarico la pagina */
          document.location = result.referrer;
        }
      }
    );
  } );

  /**
   * Call the init when the document is ready
   *
   * @brief Document Ready
   */
  $( document ).ready( function () {
    $this.init();
  } );

  /**
   * Remove the A tag to create a separator item for wpXtreme menu.
   *
   * @brief Hack the WordPress menu
   *
   * @private
   */
  function _hackMenu() {
    $( 'ul#adminmenu .wp-submenu a[href*=wpdk_menu_divider]' ).each( function ( i, e ) {
      var $content = $( this ).html();
      $( this ).parent().replaceWith( '<li class="wpdk_menu_divider">' + $content + '</li>' );
    } );
  }

  return $this;

})( jQuery );

/**
 * Utility for Twitter Bootstrap Modal dialog.
 *
 * @class           WPDK
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-10-29
 * @version         0.2.1
 *
 */
var WPDKTwitterBootstrapModal = function ( $id, $title, $content ) {

  /**
   * Resolve conflict
   *
   * @brief jQuery
   *
   * @type {*}
   */
  var $ = window.jQuery;

  /**
   * @brief Instance
   *
   * @type {WPDKTwitterBootstrapModal}
   */
  var $this = this;

  $this.version = '0.2.1';

  $this.id = $id;
  $this.title = $title;
  $this.content = $content;
  $this.width = '';
  $this.height = '';
  $this.close_button = true;
  $this.buttons = [];
  $this.data = [];

  // -----------------------------------------------------------------------------------------------------------------
  // Private methods
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * Return the HTML aria title format
   *
   * @brief Return the aria title
   *
   * @return string
   */
  function aria_title() {
    return $this.id + '-title';
  }

  /**
   * Return the HTML markup for top right dismiss button [x]
   *
   * @brief Dismiss button
   *
   * @return {string}
   */
  function close_button() {
    var $result = '';
    if ( $this.close_button ) {
      $result = '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
    }
    return $result;
  }

  /**
   * Build the inline CSS style for width and heght
   *
   * @brief Get the size
   *
   * @return string
   */
  function size() {
    var $result = '';
    var $styles = [];

    if ( !empty( $this.width ) ) {
      $styles['width'] = $this.width + 'px';
    }

    if ( !empty( $this.height ) ) {
      $styles['height'] = $this.height + 'px';
    }

    var $inline_style = '';
    for ( $key in $styles ) {
      $inline_style += $key + ':' + $styles[$key] + ';';
    }

    if ( !empty( $inline_style ) ) {
      $result = 'style="' + $inline_style + '"';
    }

    return $result;

  }

  /**
   * Return the HTML markup for footer buttons
   *
   * @brief Footer buttons
   *
   * @return string
   */
  function buttons() {
    var $result = '';
    if ( !empty( $this.buttons ) ) {
      var $buttons = '';
      for ( $key in $this.buttons ) {
        var $value = $this.buttons[$key];
        var $class = isset( $value['classes'] ) ? $value['classes'] : isset( $value['class'] ) ? $value['class'] : '';
        var $label = isset( $value['label'] ) ? $value['label'] : '';
        var $data_dismiss = ( isset( $value['dismiss'] ) && true == $value['dismiss'] ) ? 'data-dismiss="modal"' : '';
        $buttons += sprintf( '<button id="%s" class="btn button %s" %s aria-hidden="true">%s</button>', $key, $class, $data_dismiss, $label );
      }
    }

    if ( !empty( $buttons ) ) {
      $result = sprintf( '<div class="modal-footer">%s</div>', $buttons );
    }

    return $result;
  }

  /**
   * Return the HTML attribute markup for 'data-' attribute
   *
   * @brief Build data attribute
   *
   * @return string
   */
  function data() {
    var $result = '';
    var $stack = [];
    if ( !empty( $this.data ) ) {
      for ( var $key in $this.data ) {
        var $value = $this.data[$key];
        $stack.push( sprintf( 'data-%s="%s"', $key, $value ) );
      }
      $result = join( ' ', $stack );
    }
    return $result;
  }

  /**
   * Return the HTML markup for Twitter boostrap modal
   *
   * @brief Get HTML
   *
   * @return string
   */
  $this.html = function () {
    var $content = '';

    $content =
      '<div class="wpdk-modal hide fade" ' +
      data() +
      'id="' + $this.id + '"' +
      'tabindex="-1"' +
      'role="dialog"' +
      'aria-labelledby="' + aria_title() + '"' +
      'aria-hidden="true">' +
       '<div class="modal-dialog">' +
        '<div class="modal-content">' +
         '<div class="modal-header">' +
          close_button() +
          '<h4 class="modal-title" id="' + aria_title() + '">' + $this.title + '</h4>' +
         '</div>' +
         '<div class="modal-body" ' + size() + ' >' +
          $this.content +
         '</div>' +
         buttons() +
        '</div><!-- /.modal-content -->' +
       '</div><!-- /.modal-dialog -->' +
      '</div><!-- /.wpdk-modal -->';

    return $content;
  };

  /**
   * Display the Twitter boostrap modal
   *
   * @brief Display
   */
  $this.display = function () {
    $( 'body' ).append( $this.html() );
    $( '#' + $this.id ).wpdkModal( 'show' );
    $( '#' + $this.id ).on( 'hidden', function () {
      $( this ).remove();
    } );

    /* Twitter Bootstrap v.3.0.0 */
    $( '#' + $this.id ).on( 'hidden.wpdk.modal', function () {
      $( this ).remove();
    } );
  };

  /**
   * Add a footer button
   *
   * @brief Add button
   *
   * @param string $id      Unique id for button
   * @param string $label   Text label
   * @param bool   $dismiss TRUE for data-dismiss
   * @param string $class   Addition CSS class
   */
  $this.add_buttons = function ( $id, $label, $dismiss, $class ) {
    $this.buttons[$id] = {
      label   : $label,
      classes : $class || '',
      dismiss : $dismiss || true
    };
  };

  /**
   * Add an attribute data
   *
   * @brief Add data
   */
  $this.add_data = function ( $key, $value ) {
    $this.data.push(
      {
        key   : $key,
        value : $value
      } );
  };

  // -----------------------------------------------------------------------------------------------------------------
  // Public utility methods
  // -----------------------------------------------------------------------------------------------------------------

  /**
   * Return the HTML markup for button tag to open this modal dialog
   *
   * @brief Return a button for open this dialog
   *
   * @param string $label Text button label
   * @param string $class Additional class
   *
   * @return string
   */
  $this.button_open_modal = function ( $label, $class ) {
    $id = '#' + $this.id;
    $result = sprintf( '<button class="button %s" type="button" data-toggle="modal" data-target="%s">%s</button>', ( $class || '' ), $id, $label );
    return $result;
  }

};


/**
 * Plugin ribbonize
 *
 * @todo To complete
 */
(function ( $, window, document, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = "ribbonize",
    defaults = {
      propertyName : "value"
    };

  // The actual plugin constructor
  function Plugin( element, content, options ) {
    this.element = element;
    this.content = content;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options );

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {

    init : function () {
      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.options
      // you can add more functions like the one below and
      // call them like so: this.yourOtherFunction(this.element, this.options).

      if ( !$( this.element ).next().hasClass( 'wpdk-ribbon' ) ) {
        var $html = '';
        $html += '<div class="wpdk-ribbon fade right">';
        $html += '<div class="wpdk-ribbon-arrow"></div>';
        $html += '<div class="wpdk-ribbon-inner">' + this.content + '</div>';
        $html += '</div>';

        $( this.element ).after( $html );

        if( '' !== this.content ) {
          $( this.element ).next().addClass( 'in' );
        }
      }
    },

    yourOtherFunction : function ( el, options ) {
      // some logic
    }

  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( content, options ) {
    return this.each( function () {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, content, options ) );
      }
      else if ( '' !== content ) {
        $( this ).next().find( '.wpdk-ribbon-inner' ).html( content );
        $( this ).next().addClass( 'in' );
      }
      else if ( '' == content ) {
        $( this ).next().removeClass( 'in' );
      }
    } );
  };

})( jQuery, window, document );


if( typeof( jQuery.fn.transition ) === 'undefined' ) {
/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

}

if( typeof( jQuery.fn.wpdkModal ) === 'undefined' ) {
/* ========================================================================
 * wpdkModal based on Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.wpdk.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.wpdk.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.wpdk.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.wpdk.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.wpdk.modal') // guard against infinite focus loop
      .on('focusin.wpdk.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.wpdk.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.wpdk.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.wpdk.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.wpdkModal

  $.fn.wpdkModal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('wpdk.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('wpdk.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.wpdkModal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.wpdkModal.noConflict = function () {
    $.fn.wpdkModal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.wpdk.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.wpdk.modal',  '.wpdk-modal', function () { $(document.body).addClass('wpdk-modal-open') })
    .on('hidden.wpdk.modal', '.wpdk-modal', function () { $(document.body).removeClass('wpdk-modal-open') })

}(window.jQuery);

}

if( typeof( jQuery.fn.wpdkTooltip ) === 'undefined' ) {
/* ========================================================================
 * wpdkTooltip based on Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('wpdkTooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="wpdk-tooltip-box"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.wpdkTooltip

  $.fn.wpdkTooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.wpdkTooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.wpdkTooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.wpdkTooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.wpdkTooltip.noConflict = function () {
    $.fn.wpdkTooltip = old
    return this
  }

}(window.jQuery);
}

if( typeof( jQuery.fn.wpdkButton ) === 'undefined' ) {
/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.wpdkButton

  $.fn.wpdkButton = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.wpdkButton')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.wpdkButton', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.wpdkButton.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.wpdkButton.noConflict = function () {
    $.fn.wpdkButton = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.wpdkButton.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.wpdkButton('toggle')
    e.preventDefault()
  })

}(window.jQuery);
}

if( typeof( jQuery.fn.wpdkAlert ) === 'undefined' ) {
/* ========================================================================
 * wpdkAlert based on Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.wpdk.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.wpdk.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.wpdkAlert

  $.fn.wpdkAlert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('wpdk.alert')

      if (!data) $this.data('wpdk.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.wpdkAlert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.wpdkAlert.noConflict = function () {
    $.fn.wpdkAlert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.wpdk.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
}

/**
 * Tribute to Amiga - Software failure / Guru Meditation
 * Usage: GuruMeditation.display( 'Your custom messahe' );
 *
 * @class           GuruMeditation
 * @author          =undo= <info@wpxtre.me>
 * @copyright       Copyright (C) 2012-2013 wpXtreme Inc. All Rights Reserved.
 * @date            2013-05-28
 * @version         1.0.0
 */
var GuruMeditation = (function ( $ ) {

  var $this = {};
  var div, timer;

  $this.version = '1.0.0';

  // Not used yet
  $( document ).ready( function () {} );

  // Display
  $this.display = function ( $error ) {

    _init( $error );

    if ( !$( 'body > #guru-meditation' ).length ) {
      $( 'body' ).prepend( div );
      timer = setInterval( function () {
        $( '#guru-meditation' ).toggleClass( 'red' );
      }, 1000 );
      $( '#guru-meditation' ).on( 'click', function ( event ) {
        $this.hide();
      } );
    }
  }

  // Hide
  $this.hide = function () {
    if ( $( 'body > #guru-meditation' ).length ) {
      clearInterval( timer );
      $( '#guru-meditation' ).remove();
      $( '#guru-meditation-style' ).remove();
    }
  }

  // Init markup
  function _init( $error ) {

    if ( 'undefined' == typeof( $error) ) {
      $error = '#00000025.65045330';
    }

    div = '<style id="guru-meditation-style" type="text/css">' +
      '#guru-meditation {' +
      'height:120px;' +
      'background-color:#111;' +
      'border:6px solid #111;' +
      'text-align:center;' +
      '}' +
      '#guru-meditation.red {' +
      'border-color:#b00' +
      '}' +
      '#guru-meditation p {' +
      'font-size:18px;' +
      'font-family: \'Times New Roman\';' +
      'margin:24px 0;' +
      'color: #b00;' +
      'text-align:center;' +
      '}' +
      '</style>' +
      '<div id="guru-meditation">' +
      '<p>Software Failure. Press left mouse button to continue.</p>' +
      '<p>Guru meditation <span>' +
      $error +
      '</span></p>' +
      '</div>';
  }

  return $this;

})( jQuery );

/*!
 * Write a cookie to debug the javascript library versions
 * Use this cookie from PHP for debug.
 */
(function ( $ )
{
  var versions =
  {
    'jQuery'                    : WPDKjQuery.jQueryVersion(),
    'jQuery UI'                 : WPDKjQuery.jQueryUIVersion(),
    'WPDK'                      : WPDK.version,
    'WPDKControls'              : WPDKControls.version,
    'WPDKTwitterBootstrap'      : WPDKTwitterBootstrap.version,
    'WPDKjQuery'                : WPDKjQuery.version,
    'WPDKDynamicTable'          : WPDKDynamicTable.version,
    'GuruMeditation'            : GuruMeditation.version
  };

  var cookie = [];

  for ( version in versions ) {
    cookie.push( sprintf( '"%s":"v.%s"', version, versions[version] ) );
  }

  var json = sprintf( '{%s}', cookie.join(',') );

  jQuery.cookie( 'wpdk_javascript_library_versions', json, { path : '/' } );

})( jQuery );
