<?php
/**
 * Plugin Name: NFIL3D App Cart Handoff
 * Description: Lets the NFIL3D mobile/web app hand a multi-item cart to WooCommerce checkout via ?nf_cart=ID:QTY,ID:QTY.
 * Version: 1.0.0
 *
 * Install: upload to wp-content/mu-plugins/ (or as a normal plugin and activate).
 * Without it, the app's checkout still works for the first cart item.
 */

if (!defined('ABSPATH')) {
	exit;
}

add_action('wp_loaded', function () {
	if (empty($_GET['nf_cart']) || !function_exists('WC') || !WC()->cart) {
		return;
	}

	$pairs = explode(',', sanitize_text_field(wp_unslash($_GET['nf_cart'])));
	foreach (array_slice($pairs, 0, 30) as $pair) {
		$parts = array_pad(explode(':', $pair), 2, 1);
		$product_id = absint($parts[0]);
		$qty = max(1, min(99, absint($parts[1])));
		if ($product_id) {
			WC()->cart->add_to_cart($product_id, $qty);
		}
	}

	// Remove the handoff params so a refresh does not add items twice.
	wp_safe_redirect(remove_query_arg(array('nf_cart', 'add-to-cart', 'quantity')));
	exit;
}, 25); // after WooCommerce's own add-to-cart handler (priority 20)
