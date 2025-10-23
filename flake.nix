{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
	};

	outputs = { self, nixpkgs } @ inputs:
	let
		system = "x86_64-linux";
		
		pkgs = import inputs.nixpkgs{
			inherit system;
			config.allowUnfree = true;
		};
	in 
	{
		devShells.${system}.default = pkgs.mkShell rec {
			name="Pyxis";
			GDK_BACKEND = "x11";
			GIO_MODULE_DIR = "${pkgs.glib-networking}/lib/gio/modules/";
			packages = with pkgs; [
				wrapGAppsHook4
				glib-networking
				pkg-config
				gobject-introspection
				rustup
				glib
				gtk3
				openssl_3
				cargo
				cargo-tauri
				nodejs
				at-spi2-atk
				atkmm
				cairo
				gdk-pixbuf
				glib
				gtk3
				harfbuzz
				librsvg
				libsoup_3
				pango
				webkitgtk_4_1
				openssl
			];
			shellHook = "tmux -L Pyxis new-session -A -t Pyxis";
		};
	};
}
