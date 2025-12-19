{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";
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
			GIO_MODULE_DIR = "${pkgs.glib-networking}/lib/gio/modules/";
			XDG_DATA_DIRS="${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS";
			packages = with pkgs; [
				wrapGAppsHook4
				glib-networking
				pkg-config
				gobject-introspection
				gsettings-desktop-schemas
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
				webkitgtk_6_0
				openssl
				sqlite
			];
			shellHook = "tmux -L Pyxis new-session -A -t Pyxis";
		};
	};
}
