// Mock data generator
import shortid from 'shortid';
import casual from 'casual';

// just a fixed list of images to randomize from
const images = [
	'http://interfacelift.com/wallpaper/previews/03955_monacofogsummersunrise2015_672x420.jpg',
	'http://interfacelift.com/wallpaper/previews/03954_manhattansunset_672x420.jpg',
	'http://interfacelift.com/wallpaper/previews/03953_lagunadelostres_672x420.jpg',
	'http://interfacelift.com/wallpaper/previews/03952_iceland_672x420.jpg',
	'http://interfacelift.com/wallpaper/previews/03951_redsunsetinrussia_672x420.jpg'
];

const videos = [
	'https://archive.org/download/Windows7WildlifeSampleVideo/Wildlife_512kb.mp4',
	'https://archive.org/download/bet10/bet10.mp4',
	'https://archive.org/download/tsunami_penang_beach/tsunami_penang_beach_512kb.mp4',
	'https://archive.org/download/RedHotNickelBallInWaterNiceReaction/Red_Hot_Nickel_Ball_In_Water__Nice_Reaction.mp4',
	'https://archive.org/download/ClassicTrailers/Attack_of_the_Giant_Leeches_Trailer_512kb.mp4'
];

casual.define('id', () => {
	return shortid();
});

casual.define('user', () => {
	return {
		id: `user-${casual.id}`,
		email: casual.email,
		firstname: casual.first_name,
		lastname: casual.last_name,
		username: casual.username
	};
});

casual.define('mediatype', () => {
	const det = casual.random;
	if (det < 1 / 2) {
		return 'paragraph';
	} else if (det < 3 / 4) {
		return 'image';
	} else {
		return 'video';
	}
});

casual.define('paragraph', () => casual.sentence); // maybe enhance later
casual.define('image', () => images[casual.integer(0, images.length - 1)]);
casual.define('video', () => videos[casual.integer(0, videos.length - 1)]);
casual.define('media', (mediatype) => {
	switch(mediatype) {
		case 'paragraph': return casual.paragraph;
		case 'image': return casual.image;
		case 'video': return casual.video;
	}
});

export default {
	user: () => casual.user,
	message: (frm, to) => {
		return {
			id: `message-${casual.id}`,
			'from': frm.id,
			to: to.id,
			message: casual.paragraph
		};
	},
	media: (user) => {
		const mediatype = casual.mediatype;
		return {
			id: `media-${casual.id}`,
			user: user.id,
			type: mediatype,
			data: casual.media(mediatype)
		};
	},
	post: (user, medias) => {
		return {
			id: `post-${casual.id}`,
			user: user.id,
			medias
		};
	}
};