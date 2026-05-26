import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';

export default function PetDetails() {
    const router = useRouter();
    const { pet } = useLocalSearchParams();

    const parsedPet = JSON.parse(pet);

    const genderLabel =
        parsedPet.gender === 'male'
            ? '♂ Macho'
            : '♀ Fêmea';

    const statusLabel = parsedPet.available
        ? 'Disponível'
        : 'Adotado';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: parsedPet.images?.[0] }}
                    style={styles.petImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>
                    {parsedPet.name}
                </Text>

                <Text style={styles.breed}>
                    {parsedPet.breed}
                </Text>

                <View style={styles.infoBox}>
                    <Text style={styles.info}>
                        Sexo: {genderLabel}
                    </Text>

                    <Text style={styles.info}>
                        Idade: {parsedPet.age} anos
                    </Text>

                    <Text style={styles.info}>
                        Peso: {parsedPet.weight} kg
                    </Text>

                    <Text style={styles.info}>
                        Cor: {parsedPet.color}
                    </Text>

                    <Text style={styles.info}>
                        Status: {statusLabel}
                    </Text>
                </View>

                {parsedPet.story ? (
                    <>
                        <Text style={styles.sectionTitle}>
                            História
                        </Text>

                        <Text style={styles.story}>
                            {parsedPet.story}
                        </Text>
                    </>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    imageContainer: {
        height: 300,
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
    },

    petImage: {
        width: '100%',
        height: '100%',
    },

    content: {
        padding: 20,
    },

    name: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
    },

    breed: {
        fontSize: 18,
        color: '#777',
        marginBottom: 20,
    },

    infoBox: {
        backgroundColor: '#fafafa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        gap: 8,
    },

    info: {
        fontSize: 16,
        color: '#444',
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },

    story: {
        color: '#666',
        lineHeight: 22,
        marginBottom: 20,
    },

    button: {
        backgroundColor: '#E07B39',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },

    imagePlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
});