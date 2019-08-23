<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'mantor_db' );

/** MySQL database username */
define( 'DB_USER', 'mantor_db' );

/** MySQL database password */
define( 'DB_PASSWORD', 'cUCTYTo5' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'HSxB>2+{w9{K w:8)HjhLS41]]|3Z@X`T]w%urPB:UtGK7J/;YX1U`Vnk#rZ_HtP' );
define( 'SECURE_AUTH_KEY',  '$#fjM8|jEwSGkp=%@DpbtDvcF].oP<2Nwf,idZAnxHQ%}B-z(I(st8I [j4tA3Dr' );
define( 'LOGGED_IN_KEY',    'PeU<gUoFkA)F>jM$5^Ygz|=~%{e..2#ap)}1+f6`^f?TvpS=2Qdvutw9Z,_M?rwF' );
define( 'NONCE_KEY',        '.relA#r#ryN>#(I%&gtwD7*Q(-F{-#4}mkR+:M6v$f-45$C)3(!3IR x-[BITXJR' );
define( 'AUTH_SALT',        'Qmuo~F!gH>~,13 Bvb>pS+#Y_;I$-b!mWNO|qEDtK9r>`(4h(=eDyS6fgAjc@@G ' );
define( 'SECURE_AUTH_SALT', ']4_r/qMc=-(:RGn?*neDp!!Hf+F&t!X@)K#dPm.4<-f|ya4!YFydT_j+;mEfXd/B' );
define( 'LOGGED_IN_SALT',   'eEM|f,gVtOV2g^0z<65YE+Ch4$h/kNIRmL&m#uF3l&`Vi,KFh]0W]xwRuwDHt0hH' );
define( 'NONCE_SALT',       ';qmXh#gpISg6J-*}Xn~k CW(Bi6%En{l]3pFk$BPNUI_p:S<_sx=fV`{I|&#3X|h' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
